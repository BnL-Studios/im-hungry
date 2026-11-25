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

**Datum:** 2026-11-20 (sprinten avslutad)
**Deltagare:** Benjamin Simmons, Leo Spenner

## Del 1: Förberedelse

### Sprintmål

> Efter sprinten ska användaren kunna hålla matförrådet korrekt (ändra mängd/ta bort råvara) och påbörja/få ett första fungerande receptflöde från lagret: begära ett AI-förslag (US-05), läsa ett komplett recept (US-68) och förstå när inget giltigt recept kan erbjudas (US-67).

**Uppnåddes sprintmålet?** Delvis — receptflödet är implementerat på branch och manuellt E2E-testat av användaren mot riktig Gemini, men #143/#129 är öppna på GitHub och #135 är inte implementerat (implementerat på branch, issue/PR-status separat).

### Blev klart

> Enligt DoD krävs granskad PR och merge till `main`. Tabellen nedan skiljer därför på kod på branch och mergat läge; markera inte något som DoD-klart utan verifierad PR/merge.

| Issue | Story | Visas av |
|---|---|---|
| Kod på `screen-and-page-for-generate-recipe` | US-05/US-68/US-67 – receptflöde: tre flikar, modal `/generate-recipe`, navigering till `/recipe` | Manuell E2E av användaren; issue/PR-status separat |

### Blev inte klart

| Issue | Story | Varför inte klar | Vad händer med den? |
|---|---|---|---|
| #143 / #129 | Receptflödet (kod finns på branch) | GitHub-issues fortfarande öppna; PR/merge inte verifierad här | Implementerat på branch, issue/PR-status separat |
| #135 | Mängder i tillagningsstegen | Inte implementerat | Öppet kort; mängder ska in i stegen |

### Demoplan

1. Öppna **Råvaror** och visa befintliga råvaror i matförrådet.
2. Ändra mängd på en råvara (US-03), visa validering vid ogiltigt värde och att rätt mängd sparas.
3. Ta bort en råvara (US-04), visa bekräftelse/flöde och att listan uppdateras.
4. Stäng och öppna appen och visa att ändringar/borttagning finns kvar (lokal SQLite).
5. Öppna fliken **Generate Recipe**, visa modalen `/generate-recipe` och begär ett recept från lagret (US-05); kontrollera att inventory inte ändras.
6. Vid lyckad generation: navigera till `/recipe` och visa titel, ingredienser, steg och uppskattad tid (US-68). På webben finns fallbacken i `(tabs)/generate.tsx`.
7. Visa tydliga fel/tom-läge-meddelanden när recept inte kan erbjudas (US-67), t.ex. `NO_RECIPE`, `INVALID_REQUEST`, `INVALID_RECIPE`, `RATE_LIMITED`, `TIMEOUT` och `MODEL_ERROR`.
8. Kontrollera att dubbletter av ingredient-ID avvisas, att mängder inte överskrider lagersaldot och att ogiltiga råvaror filtreras bort i receptvyn.

### Frågor till läraren

- Räcker det att demo inventory-CRUD som vertikal användarresa, eller vill du också se förberedelse/spike inför Edge Function/AI-recept?
- Feedback på hur vi bör dela upp PR:er för små men sammanhängande ändringar i samma skärm/datalager.

## Del 2: Efter reviewn

> Sprinten avslutades 2026-11-20. Fyll på om reviewns feedback saknas; receptflödet är implementerat på branch, issue/PR-status separat (#143/#129 öppna, #135 ej implementerat).

### Feedback

-

### Ändringar i backloggen

-
