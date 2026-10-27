## Vad gör den här pull requesten?

<!-- Kort beskrivning av ändringen. -->

Closes #<!-- issuenummer, t.ex. Closes #4. Då stängs issuen och kortet flyttas till Klart när PR:en mergas. -->

## Hur testar man den?

<!--
  Steg för granskaren. Utgå från acceptanskriterierna.
  Exempel:
  1. Starta appen och gå till ett hushåll.
  2. Lägg till en syssla utan namn: ett felmeddelande ska visas.
  3. Lägg till en syssla med namn: den ska synas direkt i listan.
-->

1.
2.

## Definition of Done

1. Alla acceptanskriterier är uppfyllda och testade för hand.
2. Koden ligger i `main` via en pull request som granskats och godkänts av minst en annan i teamet.
3. Backend och app bygger utan fel, och flödet som ändringen gäller fungerar mot en riktig backend efter mergen.
4. Befintliga automatiska tester går igenom, och ny logik i backend har minst ett test som täcker den.
5. Inga hemligheter finns i git – Gemini-API-nyckeln och databasuppgifterna ligger i miljövariabler/`.env`, och AI-anropet görs från Spring Boot, aldrig direkt från appen.
6. Ändringar i databasschemat är gjorda som en migrering som går att köra från scratch på en tom databas.
7. Det finns inga `console.log`, `System.out.println`, utkommenterad kod eller TODO kvar i ändringen.
8. Kortet på boarden är flyttat till "Klart", och README eller `docs/` är uppdaterad om ändringen påverkar hur man startar eller använder projektet.

## Till granskaren

