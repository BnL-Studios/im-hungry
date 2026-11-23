# I'm Hungry! — mobilappen

Expo/React Native-projektet för [I'm Hungry!](../README.md).

**Status (2026-11-23):** Matförrådet läses från lokal SQLite; ändring/borttagning och skalor är mergade via #130/#141. Home-fliken har **Generera recept** och visar titel, tid, ingredienser och steg på samma skärm. Klienten i `features/recipes/generate.ts` anropar en deployad Supabase Edge Function med [kontrakt v1](../docs/ai-integration.md) från `shared/recipe-contract.ts`. **Ett riktigt Gemini-anrop med teamets nyckel är inte verifierat**; endpointen saknar ännu auth/rate limiting (#138). 5 Vitest-testfiler, 31 tester och tre gröna CI-jobb.

## Starta utvecklingsmiljön

```bash
cd mobile
npm ci
npx expo start
```

För receptflödet behövs `mobile/.env` (kopiera `mobile/.env.example`): `EXPO_PUBLIC_SUPABASE_URL` pekar på projektet och `EXPO_PUBLIC_SUPABASE_ANON_KEY` är den publika nyckeln. Hela funktions-URL:en kan anges separat med `EXPO_PUBLIC_GENERATE_RECIPE_URL`. Privata Gemini-nycklar hör aldrig hemma i `EXPO_PUBLIC_*`.

Starta i simulator/emulator, på en mobil eller med `npm run web`. En development build kan behövas när native-beroenden introduceras. Projektet använder [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/) och [Expo Router](https://docs.expo.dev/router/introduction/). Node 22+ krävs för migrationstestet, som använder `node:sqlite`.

## Struktur

```text
src/
  app/                         # Routes (Expo Router)
    _layout.tsx                # Rot-Stack + DatabaseProvider, modaler
    add-ingredient.tsx         # Modal route
    edit-ingredient.tsx        # Modal route
    (tabs)/
      _layout.tsx              # Home + Råvaror
      index.tsx                # Home: generera recept + receptvy
      ingredients/index.tsx    # Tunn route till IngredientsScreen
  screens/
    IngredientsScreen.tsx      # Lista, ändra, ta bort med bekräftelse
    AddIngredientScreen.tsx    # Formulär för ny råvara + skalväljare
    EditIngredientScreen.tsx   # Formulär för ny mängd
  features/
    inventory/
      units.ts                 # g, ml, qty; qty visas som st
      scales.ts                # mg/g/kg, ml/dl/L, st/dussin → basenhet
      validation.ts            # parseIngredientInput, parseQuantityInput
      repository.ts            # useInventoryItems, add/update/remove-hooks
      *.test.ts                # Vitest (4 filer)
    recipes/
      generate.ts              # Endpoint, anrop och svarskontroll
      generate.test.ts         # Vitest: klient och felhantering
  db/
    client.ts                  # Memoiserad Drizzle-instans (useDatabase)
    provider.tsx               # SQLiteProvider, kör migrationer vid start
    schema.ts                  # Drizzle-schema (sanningskälla)
drizzle/                       # Genererade SQL-migrationer och metadata
```

Routes i `src/app/` hålls tunna och importerar skärmar och logik från `src/screens/` och `src/features/`. Allt som inte är en route ska ligga utanför `src/app/`.

## Arkitektur

- **UI och navigation:** Expo Router + React Native/TypeScript. Rot-layouten har en Stack med flikarna och modal routes för lägg till/ändra. Appen är låst till ljust läge (`userInterfaceStyle: "light"`).
- **Matförråd:** SQLite på telefonen via `expo-sqlite` och **Drizzle ORM**. Fungerar offline.
- **Listan:** `IngredientsScreen` använder `useInventoryItems`, som kör en Drizzle `useLiveQuery` mot `inventory_items`. Listan uppdateras automatiskt när en rad infogas, ändras eller tas bort.
- **Lägga till:** `AddIngredientScreen` använder numeriskt tangentbord, validerar med `parseIngredientInput` och sparar med `useAddIngredient`. Ingen SQL och ingen duplicerad validering i skärmen.
- **Ändra och ta bort:** `EditIngredientScreen` validerar med `parseQuantityInput` och skriver med `useUpdateIngredient`. Borttagning sker via `useRemoveIngredient` först efter bekräftelse (`Alert.alert` på native, `window.confirm` på webb).
- **Migrationer:** Drizzle Kit-genererade, versionshanterade filer i `drizzle/`. De körs vid appstart innan databasfrågor utförs.
- **Recept:** Endast vid receptbegäran skickas **ingredienserna** (ID, namn, mängd, basenhet) via HTTPS till den deployade **Supabase Edge Function** som anropar **Gemini Flash** med serverlagrad hemlig nyckel. Vid framgång returneras exakt fyra toppnivåfält: `title`, `ingredients`, `steps` och `estimatedCookingTime` (minuter). Klienten validerar svaret mot snapshoten och läser lagret igen innan receptet visas. Mat-humör tillkommer efter MVP och ingår inte i request v1. Se [kontrakt v1, fel och validering](../docs/ai-integration.md).
- **Enheter och skalor:** `g`, `ml` och `qty` (visas som `st`). `scales.ts` erbjuder mg/g/kg, ml/dl/L och st/dussin och räknar om med flyttalsavrundning innan värdet sparas i basenhet. Databasen stoppar mängder som inte är positiva och enheter utanför listan.

## Flödet för att lägga till en råvara

1. Användaren öppnar fliken **Råvaror**.
2. `+ Lägg till` öppnar modalen `/add-ingredient`.
3. Formuläret validerar namn och heltalsmängd i `parseIngredientInput`; skalans faktor räknas om till basenhet (`g`, `ml` eller `st`).
4. Giltig input sparas med `useAddIngredient` → Drizzle → SQLite.
5. SQLite ändringshändelse → `useLiveQuery` → listan uppdateras.
6. Modalen stängs och användaren är tillbaka i listan.

**Ändra mängd:** knappen *Ändra* öppnar `/edit-ingredient?id=<id>` som modal. `parseQuantityInput` tillåter decimaler så att befintliga värden kan sparas oförändrade, och `useUpdateIngredient` behåller samma `unit`. **Ta bort:** knappen *Ta bort* begär bekräftelse och anropar sedan `useRemoveIngredient`.

## Databas och migrationer

Schemat ligger i `src/db/schema.ts` och har en tabell, `inventory_items`, med `CHECK`-begränsningar för positiv mängd och tillåtna enheter. Efter en schemaändring:

```bash
npx drizzle-kit generate   # skapar en ny SQL-migration i drizzle/
```

Migrationerna committas tillsammans med schemaändringen och får aldrig radera befintliga råvaror vid uppgradering. Två migrationer finns: `0000_freezing_rick_jones.sql` (tabellen) och `0001_woozy_the_order.sql` (lägger till `CHECK`-begränsningarna och bevarar befintliga rader).

## Kommandon

```bash
npm ci                    # installera enligt låsfilen
npx expo start            # starta utvecklingsservern
npm test                  # Vitest: validering, enheter, migrationer
npx tsc --noEmit          # typkontroll
npm run lint              # ESLint via expo lint
npx expo-doctor           # kontrollera beroenden och konfiguration
npx expo install --check  # visa SDK-avvikande paket
```

## Tester

- `validation.test.ts` testar inmatningsreglerna, decimaler vid redigering och avrundning (300 mg → 0,3 g).
- `scales.test.ts` testar skalomvandling till basenheter och flyttalsavrundning.
- `units.test.ts` testar enheter och formatering (`qty` → `st`).
- `migrations.test.ts` kör de riktiga SQL-migrationerna mot en temporär SQLite-databas och kontrollerar att `CHECK`-begränsningarna stoppar ogiltiga rader.
- `features/recipes/generate.test.ts` testar att klienten skickar endast `ingredients`, väljer endpoint och mappar HTTP-fel till användarmeddelanden.

Lägg aldrig hemliga API-nycklar i Expo-miljövariabler som skickas till appen, särskilt inte `EXPO_PUBLIC_*`.

**Senast uppdaterad:** 2026-11-23 (receptflöde implementerat; riktigt AI-anrop att verifiera).
