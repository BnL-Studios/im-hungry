# I'm Hungry! — mobilappen

Expo/React Native-projektet för [I'm Hungry!](../README.md).

**Status (2026-11-25, sprint 3):** Matförrådet läses från lokal SQLite med ändring, borttagning och skalor. Receptflödet finns i kod på branchen `screen-and-page-for-generate-recipe`: **Generate Recipe** öppnar en modal och ett lyckat recept visas på `/recipe`. [API-kontraktet](../docs/ai-integration.md) och Edge Function är implementerade; koden använder `gemini-3.5-flash-lite` som standard. GitHub-issuesen #143/#129 är öppna tills PR:en mergas.

## Starta utvecklingsmiljön

```bash
cd mobile
npm ci
npx expo start
```

Starta i simulator/emulator, på en mobil eller med `npm run web`. En development build kan behövas när native-beroenden introduceras. Projektet använder [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/) och [Expo Router](https://docs.expo.dev/router/introduction/). Node 22+ krävs för migrationstestet, som använder `node:sqlite`.

## Struktur

```text
src/
  app/                         # Routes (Expo Router)
    _layout.tsx                # Rot-Stack + DatabaseProvider + RecipeProvider
    add-ingredient.tsx         # Modal route
    edit-ingredient.tsx        # Modal route
    generate-recipe.tsx        # Tunn modal route
    recipe.tsx                 # Tunn receptroute
    (tabs)/
      _layout.tsx              # Hem + Generate Recipe + Råvaror
      index.tsx                # Hem: Im hungry + instruktioner
      generate.tsx             # Web-fallback till modalen
      ingredients/index.tsx    # Tunn route till IngredientsScreen
  screens/
    IngredientsScreen.tsx      # Lista, ändra, ta bort med bekräftelse
    AddIngredientScreen.tsx    # Formulär för ny råvara + skalväljare
    EditIngredientScreen.tsx   # Formulär för ny mängd
    GenerateRecipeModalScreen.tsx  # Inställningsyta + genereringsknapp
    GeneratedRecipeScreen.tsx  # De fyra kontraktfälten + empty state
  features/
    inventory/
      units.ts                 # g, ml, qty; qty visas som st
      scales.ts                # mg/g/kg, ml/dl/L, st/dussin → basenhet
      validation.ts            # parseIngredientInput, parseQuantityInput
      repository.ts            # useInventoryItems, add/update/remove-hooks
      *.test.ts                # Vitest (4 filer)
    recipes/
      generate.ts              # Snapshot, anrop och re-check mot lagret
      recipe-context.tsx       # In-memory RecipeResult mellan modal och receptvy
      useGenerateRecipe.ts     # Laddning/fel för modalen
      view-model.ts            # Filtrerar giltiga råvaror för visning
      *.test.ts                # Vitest (2 filer)
  db/
    client.ts                  # Memoiserad Drizzle-instans (useDatabase)
    provider.tsx               # SQLiteProvider, kör migrationer vid start
    schema.ts                  # Drizzle-schema (sanningskälla)
drizzle/                       # Genererade SQL-migrationer och metadata
```

Routes i `src/app/` hålls tunna och importerar skärmar och logik från `src/screens/` och `src/features/`. Allt som inte är en route ska ligga utanför `src/app/`.

## Arkitektur

- **UI och navigation:** Expo Router + React Native/TypeScript. Tre flikar: Hem, Generate Recipe och Råvaror. Rot-layouten har en Stack med modal routes för lägg till/ändra och receptgenerering; lyckad generering navigerar till `/recipe`. Appen är låst till ljust läge (`userInterfaceStyle: "light"`).
- **Matförråd:** SQLite på telefonen via `expo-sqlite` och **Drizzle ORM**. Fungerar offline.
- **Listan:** `IngredientsScreen` använder `useInventoryItems`, som kör en Drizzle `useLiveQuery` mot `inventory_items`. Listan uppdateras automatiskt när en rad infogas, ändras eller tas bort.
- **Lägga till:** `AddIngredientScreen` använder numeriskt tangentbord, validerar med `parseIngredientInput` och sparar med `useAddIngredient`. Ingen SQL och ingen duplicerad validering i skärmen.
- **Ändra och ta bort:** `EditIngredientScreen` validerar med `parseQuantityInput` och skriver med `useUpdateIngredient`. Borttagning sker via `useRemoveIngredient` först efter bekräftelse (`Alert.alert` på native, `window.confirm` på webb).
- **Migrationer:** Drizzle Kit-genererade, versionshanterade filer i `drizzle/`. De körs vid appstart innan databasfrågor utförs.
- **Recept:** Vid receptbegäran skickas **ingredienserna** (ID, namn, mängd, basenhet) via HTTPS till **Supabase Edge Function** `generate-recipe`, som anropar Gemini med serverhemligheten `GEMINI_API`. Koden defaultar till `gemini-3.5-flash-lite`; `GEMINI_MODEL` och `GEMINI_BACKUP_MODEL` kan sättas på servern. Vid framgång returneras exakt fyra toppnivåfält: `title`, `ingredients`, `steps` och `estimatedCookingTime` (minuter). Mobilen filtrerar bort råvaror utan giltigt namn/positiv mängd innan visning. Se [kontrakt v1, fel och validering](../docs/ai-integration.md).
- **Enheter och skalor:** `g`, `ml` och `qty` (visas som `st`). `scales.ts` erbjuder mg/g/kg, ml/dl/L och st/dussin och räknar om med flyttalsavrundning innan värdet sparas i basenhet. Databasen stoppar mängder som inte är positiva och enheter utanför listan.

## Miljövariabler

Kopiera `.env.example` till `.env` och fyll i:

- `EXPO_PUBLIC_SUPABASE_URL` och `EXPO_PUBLIC_SUPABASE_ANON_KEY` används för att bygga endpointen och autentisera anropet.
- `EXPO_PUBLIC_GENERATE_RECIPE_URL` är valfri och overridear den härledda URL:en (t.ex. `http://127.0.0.1:8787/functions/v1/generate-recipe` för lokal körning).

Den privata Gemini-nyckeln ska **inte** ligga här. Den läses bara av Edge Function som `GEMINI_API`, se [supabase/.env.example](../supabase/.env.example).

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

- `inventory/validation.test.ts` testar inmatningsreglerna, decimaler vid redigering och avrundning (300 mg → 0,3 g).
- `inventory/scales.test.ts` testar skalomvandling till basenheter och flyttalsavrundning.
- `inventory/units.test.ts` testar enheter och formatering (`qty` → `st`).
- `inventory/migrations.test.ts` kör de riktiga SQL-migrationerna mot en temporär SQLite-databas och kontrollerar att `CHECK`-begränsningarna stoppar ogiltiga rader.
- `recipes/generate.test.ts` testar snapshot, felkoder och att lagret kontrolleras igen före visning.
- `recipes/view-model.test.ts` testar att bara giltiga råvaror visas i receptvyn.

Totalt 6 testfiler / 34 tester. CI kör även `deno test` för Edge Function.

Lägg aldrig hemliga API-nycklar i Expo-miljövariabler som skickas till appen, särskilt inte `EXPO_PUBLIC_*`.

**Senast uppdaterad:** 2026-11-25 (sprint 3; receptflöde på feature-branch).
