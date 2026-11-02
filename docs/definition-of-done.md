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

## Versioner

| Version | Datum | Ändring | Varför |
|---|---|---|---|
| 1 | 2026-10-27 | Första versionen | Kursens gemensamma kvalitetsstandard. |
| 2 | 2026-11-02 | Anpassad för Expo, lokal SQLite/Drizzle och AI via Edge Function | Nya arkitekturbeslut 06–07. |
