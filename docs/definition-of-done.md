# Definition of Done

En story är klar när:

1. **Acceptanskriterierna** är uppfyllda, testade och relevanta fel-/tomma lägen fungerar.
2. Ändringen är integrerad till **`main` via en granskad PR** med minst en annan teammedlems godkännande. PR-författaren mergar inte sin egen PR.
3. Expo-mobilappen fungerar på avsedd plattform och aktuella **CI-kontroller** passerar. Befintliga tester är gröna och ny logik har lämpliga tester.
4. Lokal **SQLite-data** överlever omstart. Ändringar som påverkar lagring testas mot tom databas och befintlig databas.
5. Nya databasfält/tabeller levereras som **Drizzle-schema och versionshanterade SQL-migrationer** som inte raderar befintliga råvaror vid uppgradering.
6. Begäranden/svar mellan mobilapp och **Supabase Edge Function** valideras när receptflödet berörs; kontraktet är exakt `title`, `ingredients`, `steps` och `estimatedCookingTime`, dubbletter av ingredient-ID avvisas och fel såsom `NO_RECIPE`, `INVALID_REQUEST`, `INVALID_RECIPE`, `RATE_LIMITED`, `TIMEOUT`, `MODEL_ERROR`, offline och ogiltiga AI-resultat hanteras begripligt.
7. Inga hemliga AI-nycklar, känsliga uppgifter, tillfällig felsökningskod eller oavsiktliga filer finns i Git eller appens distribuerade kod.
8. Dokumentationen är uppdaterad vid ändrad funktion/arkitektur och GitHub-kortet kan flyttas till **Klart**.

## Nuvarande kontroller (sprint 3)

Körs från `mobile/`:

```bash
npx tsc --noEmit       # typkontroll
npm test               # Vitest: 6 testfiler / 34 tester (validering, skalor, enheter och SQL-migrationer)
npm run lint           # ESLint via expo lint (körs lokalt och i CI)
```

CI-workflowen [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) kör på Node 22: `npm ci`, validering av Expo-konfigurationen, `npm run lint`, `npx tsc --noEmit` och `npm test` vid PR och push till `main`. CI har även ett edge-jobb med `deno test` för `supabase/functions/generate-recipe/`.

Lokalt är typkontroll (`npx tsc --noEmit`), lint och Vitest gröna på branchen. GitHub Actions-CI för den uppdaterade branchen är inte verifierad här och ska kontrolleras av granskaren.

Manuell kontroll i sprint 2: öppna fliken **Råvaror**, lägg till en råvara med giltig och ogiltig input (inklusive skalor), ändra mängden, ta bort en råvara och bekräfta dialogrutan. Kontrollera att listan uppdateras direkt och att datan finns kvar efter omstart. Testa både native och webb.

Manuell kontroll i sprint 3: öppna appen och visa de tre flikarna **Hem / Generate Recipe / Råvaror**; startsidan visar **Im hungry** och tre steg. Öppna **Generate Recipe**, som visar modalen `/generate-recipe`, begär ett recept och kontrollera att lyckad generation navigerar till `/recipe` och att receptet innehåller `title`, `ingredients`, `steps` och `estimatedCookingTime`. Kontrollera att dubbletter av ingredient-ID avvisas, att mängder inte överskrider lagersaldot, att salt/olja/vatten kan vara basvaror utan ID och att ogiltiga råvaror filtreras bort i receptvyn. Användaren har manuellt testat end-to-end mot riktig Gemini och fått recept. Koden är implementerad på branch — implementerat på branch, issue/PR-status separat (#143/#129 öppna, #135 ej implementerat).

## Versioner

| Version | Datum | Ändring | Varför |
|---|---|---|---|
| 1 | 2026-10-27 | Första versionen | Kursens gemensamma kvalitetsstandard. |
| 2 | 2026-11-02 | Anpassad för Expo, lokal SQLite/Drizzle och AI via Edge Function | Nya arkitekturbeslut 06–07. |
| 3 | 2026-11-13 | Nuvarande test- och CI-kontroller dokumenterade; manuell kontroll för matförrådet tillagd | Dokumentationen ska matcha sprint 1. |
| 4 | 2026-11-25 | Sprint 3-kontroller, edge-jobb och manuellt receptflöde dokumenterade | Dokumentationen ska spegla branchen `screen-and-page-for-generate-recipe` utan att påstå grön CI. |
