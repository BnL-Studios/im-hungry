# I'm Hungry! — mobilappen

Expo/React Native-projektet för [I'm Hungry!](../README.md).

## Starta utvecklingsmiljön

```bash
cd mobile
npm ci
npx expo start
```

Starta i simulator/emulator eller på en mobil. En development build kan behövas när native-beroenden introduceras. Projektet använder [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/) och [Expo Router](https://docs.expo.dev/router/introduction/).

## Struktur

```text
src/
  app/          # Routes (Expo Router). Varje fil blir en skärm.
  screens/      # Skärmkomponenter (tom tills vidare)
  features/     # Domänlogik per funktion, t.ex. inventory/ (tom tills vidare)
  db/
    provider.tsx  # SQLiteProvider, kör migrationer vid start
    schema.ts     # Drizzle-schema (sanningskälla)
drizzle/        # Genererade SQL-migrationer och metadata
```

Routes i `src/app/` hålls tunna och importerar skärmar och logik från `src/screens/` och `src/features/`. Allt som inte är en route ska ligga utanför `src/app/`.

## Arkitektur

- **UI och navigation:** Expo Router + React Native/TypeScript.
- **Matförråd:** SQLite på telefonen via `expo-sqlite` och **Drizzle ORM**. Fungerar offline.
- **Migrationer:** Drizzle Kit-genererade, versionshanterade filer i `drizzle/`. De körs vid appstart innan databasfrågor utförs.
- **Recept:** Endast vid receptbegäran skickas inventariet och valt mat-humör via HTTPS till en **Supabase Edge Function**, som anropar AI med en serverlagrad hemlig nyckel. Edge Function är ännu inte byggd.
- **Enheter:** `g`, `ml` och `quantity`. Databasen stoppar mängder som inte är positiva och enheter utanför listan.

## Databas och migrationer

Schemat ligger i `src/db/schema.ts`. Efter en schemaändring:

```bash
npx drizzle-kit generate   # skapar en ny SQL-migration i drizzle/
```

Migrationerna committas tillsammans med schemaändringen och får aldrig radera befintliga råvaror vid uppgradering.

## Kommandon

```bash
npm ci                 # installera enligt låsfilen
npx expo start         # starta utvecklingsservern
npx tsc --noEmit       # typkontroll
npx expo-doctor        # kontrollera beroenden och konfiguration
npx expo install --check  # visa SDK-avvikande paket
```

Lägg aldrig hemliga API-nycklar i Expo-miljövariabler som skickas till appen, särskilt inte `EXPO_PUBLIC_*`.
