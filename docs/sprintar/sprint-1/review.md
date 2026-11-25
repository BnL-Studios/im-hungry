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

**Datum:** 2026-11-16 (genomfört)
**Deltagare:** Benjamin Simmons, Leo Spenner och läraren

## Del 1: Förberedelse

### Sprintmål

Användaren kan navigera mellan **Home** och **Råvaror**, se sitt matförråd från lokal SQLite och lägga till en råvara med namn, mängd och enhet.

**Uppnåddes sprintmålet?** **Ja.** US-01 och US-02 är granskade och mergade till `main` via PR #122 (2026-11-13), och listan läser nu från lokal SQLite.

### Blev klart

| Issue | Story | Visas av |
|---|---|---|
| [#21](https://github.com/BnL-Studios/im-hungry/issues/21) | US-01 – Visa matförrådet | Benjamin |
| [#20](https://github.com/BnL-Studios/im-hungry/issues/20) | US-02 – Lägg till råvara | Leo |

**Tekniskt delsteg på `main`:** Expo-grundprojekt, flikar, lokal SQLite med Drizzle, två migrationer, testuppsättning och CI.

### Blev inte klart

| Issue | Story | Varför inte klar | Vad händer med den? |
|---|---|---|---|
| [#26](https://github.com/BnL-Studios/im-hungry/issues/26) | US-03 – Korrigera mängd | Inte påbörjad; sprinten fokuserade på lista + tillägg. | Sprint 2, ansvarig Leo. |
| [#27](https://github.com/BnL-Studios/im-hungry/issues/27) | US-04 – Ta bort råvara | Inte påbörjad; kräver raderingsflöde och bekräftelse. | Sprint 2, ansvarig Leo. |
| [#22](https://github.com/BnL-Studios/im-hungry/issues/22) m.fl. | US-05/US-68/US-67 – Receptflödet | Kräver Edge Function, AI-nyckel och validering av AI-svar. | Sprint 2 som #22 (delkort #125–#129), #23 och #24. |
| [#25](https://github.com/BnL-Studios/im-hungry/issues/25) | US-06 – Mat-humör | Inte påbörjad. | Backloggen; utanför sprint 2. |

**Kvarvarande arbete då:** `Home` var vid sprint 1 en `Hello World`-placeholder; i dag visar startsidan **Im hungry** och tre steg och appen har tre flikar (Hem / Generate Recipe / Råvaror). Verifiera US-01/US-02 manuellt på en riktig enhet om det inte gjordes före merge, och uppdatera README/docs i sprint 2.

### Demoplan

1. Starta appen och visa flikarna **Home** och **Råvaror** (sprint 1 hade två flikar; nu Hem / Generate Recipe / Råvaror).
2. Öppna **Råvaror** och visa tomt läge.
3. Tryck **+ Lägg till**, visa modalens fält för namn, mängd och enhet.
4. Försök spara tomt namn, ogiltig mängd och noll/negativ mängd; visa fälten.
5. Spara en giltig råvara (t.ex. `Mjöl`, `500`, `g`) och visa att den syns direkt i listan.
6. Stäng och öppna appen igen och visa att råvaran finns kvar.
7. Visa kort att datan ligger i lokal SQLite. Receptflödet byggdes senare och är i dag implementerat på branch — implementerat på branch, issue/PR-status separat (#143/#129 öppna).

### Frågor till läraren

- Vilken nivå av dokumentation förväntas per sprint utöver planning/review/retro?
- Är det rimligt att lägga AI-receptflödet (Edge Function + gratis AI-nivå) i sprint 2, eller bör vi spika en tekniskt mindre del först?

## Del 2: Efter reviewn

> Reviewn hölls 2026-11-16; komplettera feedbacken här om den saknas.

### Feedback

-

### Ändringar i backloggen

-
