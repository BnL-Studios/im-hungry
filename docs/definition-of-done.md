# Definition of Done

En story är klar när:

1. **Acceptanskriterierna** är uppfyllda, testade och relevanta fel-/tomma lägen fungerar.
2. Ändringen är integrerad till **`main` via en granskad PR** med minst en annan teammedlems godkännande. PR-författaren mergar inte sin egen PR.
3. Expo-mobilappen fungerar på avsedd plattform och aktuella **CI-kontroller** passerar. Befintliga tester är gröna och ny logik har lämpliga tester.
4. Lokal **SQLite-data** överlever omstart. Ändringar som påverkar lagring testas mot tom databas och befintlig databas.
5. Nya databasfält/tabeller levereras som **Drizzle-schema och versionshanterade SQL-migrationer** som inte raderar befintliga råvaror vid uppgradering.
6. Begäranden/svar mellan mobilapp och **Supabase Edge Function** valideras när receptflödet berörs; fel såsom timeout, offline och ogiltiga AI-resultat hanteras begripligt.
7. Inga hemliga AI-nycklar, känsliga uppgifter, tillfällig felsökningskod eller oavsiktliga filer finns i Git eller appens distribuerade kod.
8. Dokumentationen är uppdaterad vid ändrad funktion/arkitektur och GitHub-kortet kan flyttas till **Klart**.

## Nuvarande kontroller (sprint 1)

Körs från `mobile/`:

```bash
npx tsc --noEmit       # typkontroll
npm test               # Vitest: validering, enheter och SQL-migrationer
npm run lint           # ESLint via expo lint (lokalt; ingår inte i CI ännu)
```

CI-workflowen [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) kör på Node 22: `npm ci`, validering av Expo-konfigurationen, `npx tsc --noEmit` och `npm test` vid PR och push till `main`.

Manuell kontroll i sprint 1: öppna fliken **Råvaror**, lägg till en råvara med giltig och ogiltig input, kontrollera att listan uppdateras direkt och att datan finns kvar efter omstart. Testa gärna både Expo Go/simulator och webb.

## Versioner

| Version | Datum | Ändring | Varför |
|---|---|---|---|
| 1 | 2026-10-27 | Första versionen | Kursens gemensamma kvalitetsstandard. |
| 2 | 2026-11-02 | Anpassad för Expo, lokal SQLite/Drizzle och AI via Edge Function | Nya arkitekturbeslut 06–07. |
| 3 | 2026-11-13 | Nuvarande test- och CI-kontroller dokumenterade; manuell kontroll för matförrådet tillagd | Dokumentationen ska matcha sprint 1. |
