# Definition of Done

<!--
  INSTRUKTION
  Det här gäller för ALLA stories. Det som gäller för en specifik story hör hemma i dess acceptanskriterier.
  Börja med 5–8 punkter som alla förstår och kan följa. Varje punkt ska gå att svara ja eller nej på.
  Se över listan på varje retro. Lägg till när ni ser att något behövs, och skriv ner varför i tabellen längst ner.
  Exemplet nedan kan användas som utgångspunkt, men diskutera varje punkt: håller ni med?
-->

En story är klar när:

1. Alla acceptanskriterier är uppfyllda och testade för hand.
2. Koden ligger i `main` via en pull request som granskats och godkänts av minst en annan i teamet.
3. Backend och app bygger utan fel, och flödet som ändringen gäller fungerar mot en riktig backend efter mergen.
4. Befintliga automatiska tester går igenom, och ny logik i backend har minst ett test som täcker den.
5. Inga hemligheter finns i git – Gemini-API-nyckeln och databasuppgifterna ligger i miljövariabler/`.env`, och AI-anropet görs från Spring Boot, aldrig direkt från appen.
6. Ändringar i databasschemat är gjorda som en migrering som går att köra från scratch på en tom databas.
7. Det finns inga `console.log`, `System.out.println`, utkommenterad kod eller TODO kvar i ändringen.
8. Kortet på boarden är flyttat till "Klart", och README eller `docs/` är uppdaterad om ändringen påverkar hur man startar eller använder projektet.

## Versioner

| Version | Datum | Ändring | Varför (från vilken retro?) |
|---|---|---|---|
| 1 | [ÅÅÅÅ-MM-DD] | Första versionen | – |
| | | | |
