# Sprint review: sprint 2

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

**Datum:** 2026-11-20 (planerat, bekräfta tid med läraren)
**Deltagare:** Benjamin Simmons, Leo Spenner (planerat)

## Del 1: Förberedelse

### Sprintmål

> Efter sprinten ska användaren kunna hålla matförrådet korrekt (ändra mängd/ta bort råvara) och påbörja/få ett första fungerande receptflöde från lagret: begära ett AI-förslag (US-05), läsa ett komplett recept (US-68) och förstå när inget giltigt recept kan erbjudas (US-67).

**Uppnåddes sprintmålet?** Ja / Delvis / Nej

### Blev klart

> Visa bara stories som uppfyller Definition of Done (granskad PR, mergad till `main`, accepterade kriterier uppfyllda).

| Issue | Story | Visas av |
|---|---|---|
| | | |

### Blev inte klart

| Issue | Story | Varför inte klar | Vad händer med den? |
|---|---|---|---|
| | | | |

### Demoplan

1. Öppna **Råvaror** och visa befintliga råvaror i matförrådet.
2. Ändra mängd på en råvara (US-03), visa validering vid ogiltigt värde och att rätt mängd sparas.
3. Ta bort en råvara (US-04), visa bekräftelse/flöde och att listan uppdateras.
4. Stäng och öppna appen och visa att ändringar/borttagning finns kvar (lokal SQLite).
5. Begär ett receptförslag från lagret (US-05) och visa att inventory inte ändras.
6. Visa ett komplett recept med ingrediensmängder, steg och tid när tillgängligt (US-68).
7. Visa tydliga fel/tom-läge-meddelanden när recept inte kan erbjudas (US-67), t.ex. tomt lager eller tjänstefel.

### Frågor till läraren

- Räcker det att demo inventory-CRUD som vertikal användarresa, eller vill du också se förberedelse/spike inför Edge Function/AI-recept?
- Feedback på hur vi bör dela upp PR:er för små men sammanhängande ändringar i samma skärm/datalager.

## Del 2: Efter reviewn

### Feedback

-

### Ändringar i backloggen

-
