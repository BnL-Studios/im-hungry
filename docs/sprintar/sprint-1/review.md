# Sprint review: sprint 1

<!--
  INSTRUKTION
  Del 1 fylls i INNAN reviewn, senast söndag kväll. Det är ert manus.
  Del 2 fylls i UNDER eller DIREKT EFTER reviewn.

  Reviewn med läraren är ungefär 20 minuter:
  - Sprintmål och vad som blev klart (2 min)
  - Demo av fungerande mjukvara (10 min)
  - Feedback och frågor (8 min)

  Visa bara stories som uppfyller Definition of Done. Halvfärdigt redovisas under "Blev inte klart".
  Demot ska köras på riktigt, inte med skärmdumpar. Testa det innan.
-->

**Datum:** 2026-11-16 (planerat)
**Deltagare:** Benjamin Simmons, Leo Spenner och läraren (planerat)

## Del 1: Förberedelse

### Sprintmål

Användaren kan navigera mellan **Home** och **Råvaror**, se sitt matförråd från lokal SQLite och lägga till en råvara med namn, mängd och enhet.

**Uppnåddes sprintmålet?** **Delvis.** Funktionen är implementerad på branchen `add-ingredient`, men den är ännu inte granskad och mergad till `main`. Enligt Definition of Done räknas stories som klara först efter granskad PR och merge.

### Blev klart

Inga stories är formellt klara enligt Definition of Done ännu: branchen `add-ingredient` är inte granskad och mergad.

**Tekniskt delsteg på `main`:** Expo-grundprojekt, flikar, lokal SQLite med Drizzle, två migrationer, testuppsättning och CI.

### Nästan klart — väntar review/merge

| Issue | Story | Status | Visas av |
|---|---|---|---|
| [#21](https://github.com/BnL-Studios/im-hungry/issues/21) | US-01 – Visa matförrådet | Implementerad på branch; väntar review/merge. | Benjamin |
| [#20](https://github.com/BnL-Studios/im-hungry/issues/20) | US-02 – Lägg till råvara | Implementerad på branch; väntar review/merge. | Leo |

### Blev inte klart

| Issue | Story | Varför inte klar | Vad händer med den? |
|---|---|---|---|
| – | US-03 – Korrigera mängd | Inte påbörjad; sprinten fokuserade på lista + tillägg. | Nästa sprint. |
| – | US-04 – Ta bort råvara | Inte påbörjad; kräver raderingsflöde och bekräftelse. | Nästa sprint. |
| – | US-05/US-68/US-67 – Receptflödet | Kräver Edge Function, AI-nyckel och validering av AI-svar. | Efter inventariets CRUD. |
| – | US-06 – Mat-humör | Inte påbörjad. | Nästa sprint eller senare. |

**Kvarvarande arbete:** granska och merga `add-ingredient`, verifiera flödet på en riktig enhet och uppdatera dokumentationen i samma PR. Home-fliken är fortfarande en `Hello World`-placeholder.

### Demoplan

1. Starta appen och visa flikarna **Home** och **Råvaror**.
2. Öppna **Råvaror** och visa tomt läge.
3. Tryck **+ Lägg till**, visa modalens fält för namn, mängd och enhet.
4. Försök spara tomt namn, ogiltig mängd och noll/negativ mängd; visa fälten.
5. Spara en giltig råvara (t.ex. `Mjöl`, `500`, `g`) och visa att den syns direkt i listan.
6. Stäng och öppna appen igen och visa att råvaran finns kvar.
7. Visa kort att datan ligger i lokal SQLite och att receptflödet ännu inte är byggt.

### Frågor till läraren

- Vilken nivå av dokumentation förväntas per sprint utöver planning/review/retro?
- Är det okej att US-01/US-02 redovisas som "implementerade men ej mergade" på reviewn?

## Del 2: Efter reviewn

> Fylls i efter reviewn 2026-11-16.

### Feedback

-

### Ändringar i backloggen

-
