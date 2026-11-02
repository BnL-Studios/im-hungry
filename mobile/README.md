# I'm Hungry! — mobilappen

Detta är Expo/React Native-projektet för [I'm Hungry!](../README.md).

## Starta utvecklingsmiljön

```bash
cd mobile
npm ci
npx expo start
```

Starta i simulator/emulator eller på en mobil. En development build kan behövas när native-beroenden introduceras. [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/) · [Expo Router](https://docs.expo.dev/router/introduction/).

## Planerad arkitektur

- **UI och navigation:** Expo Router + React Native/TypeScript.
- **Matförråd:** SQLite lagrat på telefonen, nås via `expo-sqlite` och **Drizzle ORM**.
- **Migrationshantering:** Drizzle Kit-genererade och versionshanterade migrationer. Körs innan databasberoende skärmar öppnas.
- **Recept:** Endast vid receptbegäran skickas inventariet och valt mat-humör via HTTPS till en **Supabase Edge Function**, som anropar AI med serverlagrad hemlig nyckel.
- **Offline:** Matförrådets CRUD ska fungera offline. Receptgenerering kräver internet.

Detta är den **beslutade designen**, inte en uppgift om att funktionerna redan är implementerade. Se [arkitektur](../docs/arkitektur.md) och [MVP](../docs/mvp.md).

## Utvecklingskommandon

```bash
npm ci
npx expo start
npx tsc --noEmit  # först när TypeScript-källkod finns i src/
```

När Drizzle är installerat ska dess faktiska migrationskommandon dokumenteras här. Lägg aldrig hemliga API-nycklar i Expo-miljövariabler som skickas till appen; särskilt inte `EXPO_PUBLIC_*`.
