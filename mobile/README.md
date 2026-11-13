# I'm Hungry! — mobilappen

Expo/React Native-projektet för [I'm Hungry!](../README.md).

**Status (2026-11-13, sprint 1):** Matförrådslistan läser från lokal SQLite och en råvara kan läggas till via en modal. Arbetet ligger på branchen `add-ingredient` och väntar på granskning/merge. Receptflödet är inte byggt.

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
    _layout.tsx                # Rot-Stack + DatabaseProvider
    add-ingredient.tsx         # Modal route
    (tabs)/
      _layout.tsx              # Home + Råvaror
      index.tsx                # Home (placeholder)
      ingredients/index.tsx    # Tunn route till IngredientsScreen
  screens/
    IngredientsScreen.tsx      # Lista, laddning, empty-state, fel, add-knapp
    AddIngredientScreen.tsx    # Formulär för ny råvara
  features/
    inventory/
      units.ts                 # g, ml, qty; qty visas som st
      validation.ts            # parseIngredientInput
      repository.ts            # useInventoryItems, useAddIngredient
      *.test.ts                # Vitest
  db/
    client.ts                  # Memoiserad Drizzle-instans (useDatabase)
    provider.tsx               # SQLiteProvider, kör migrationer vid start
    schema.ts                  # Drizzle-schema (sanningskälla)
drizzle/                       # Genererade SQL-migrationer och metadata
```

Routes i `src/app/` hålls tunna och importerar skärmar och logik från `src/screens/` och `src/features/`. Allt som inte är en route ska ligga utanför `src/app/`.

## Arkitektur

- **UI och navigation:** Expo Router + React Native/TypeScript. Rot-layouten har en Stack med flikarna och en modal route.
- **Matförråd:** SQLite på telefonen via `expo-sqlite` och **Drizzle ORM**. Fungerar offline.
- **Listan:** `IngredientsScreen` använder `useInventoryItems`, som kör en Drizzle `useLiveQuery` mot `inventory_items`. Listan uppdateras automatiskt när en rad infogas, ändras eller tas bort.
- **Lägga till:** `AddIngredientScreen` validerar med `parseIngredientInput` och sparar med `useAddIngredient`. Ingen SQL och ingen duplicerad validering i skärmen.
- **Migrationer:** Drizzle Kit-genererade, versionshanterade filer i `drizzle/`. De körs vid appstart innan databasfrågor utförs.
- **Recept:** Endast vid receptbegäran ska inventariet och valt mat-humör skickas via HTTPS till en **Supabase Edge Function**, som anropar AI med en serverlagrad hemlig nyckel. Edge Function är ännu inte byggd.
- **Enheter:** `g`, `ml` och `qty` (visas som `st` i gränssnittet). Databasen stoppar mängder som inte är positiva och enheter utanför listan.

## Flödet för att lägga till en råvara

1. Användaren öppnar fliken **Råvaror**.
2. `+ Lägg till` öppnar modalen `/add-ingredient`.
3. Formuläret validerar namn, mängd och enhet i `parseIngredientInput`.
4. Giltig input sparas med `useAddIngredient` → Drizzle → SQLite.
5. SQLite ändringshändelse → `useLiveQuery` → listan uppdateras.
6. Modalen stängs och användaren är tillbaka i listan.

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

- `validation.test.ts` testar inmatningsreglerna.
- `units.test.ts` testar enheter och formatering (`qty` → `st`).
- `migrations.test.ts` kör de riktiga SQL-migrationerna mot en temporär SQLite-databas och kontrollerar att `CHECK`-begränsningarna stoppar ogiltiga rader.

Lägg aldrig hemliga API-nycklar i Expo-miljövariabler som skickas till appen, särskilt inte `EXPO_PUBLIC_*`.

**Senast uppdaterad:** 2026-11-13 (sprint 1).
