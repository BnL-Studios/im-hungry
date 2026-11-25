# Sprint review: sprint 3

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

> **Kodstatus 2026-11-25:** Branchen `screen-and-page-for-generate-recipe` har #143/#129 i kod: Generate Recipe-fliken öppnar `/generate-recipe`, och receptet visas på `/recipe` med titel, ingredienser, steg och uppskattad tid. Riktig Gemini-generering är testad i appen. Korten är öppna på GitHub tills PR:en mergas. Mat-humör, kök, maxtid, portioner, ett nytt förslag (#25, #28–#31) och mängder i stegen (#135) är inte implementerade.

**Datum:**
**Deltagare:**

## Del 1: Förberedelse

### Sprintmål

<!-- Kopiera från planning.md. -->

> Efter sprinten ska användaren kunna få ett recept från matförrådet som passar valt mat-humör, kök, maxtid och antal portioner, se mängderna direkt i receptstegen och be om ett annat förslag med samma val.

**Uppnåddes sprintmålet?** Ja / Delvis / Nej

### Blev klart

| Issue | Story | Visas av |
|---|---|---|
| | | |
| | | |

### Blev inte klart

<!-- Vad och varför? Det är inget misslyckande, men det ska förklaras. -->

| Issue | Story | Varför inte klar | Vad händer med den? |
|---|---|---|---|
| | | | |

### Demoplan

<!-- I vilken ordning visar ni? Vem gör vad? Berätta det som en användares väg genom appen, inte story för story. -->

Visa de delar som uppfyller [Definition of Done](../../definition-of-done.md). Planen nedan är det ursprungliga sprintmålet; nuvarande kod på branchen stöder bara receptgenerering och receptskärm.

1. Öppna receptmodalen från fliken **Generate Recipe** i navigeringen (#143).
2. Kontrollera att modalen använder råvarorna i lagret; inga preferensval finns ännu (#25, #29–#31 är öppna).
3. Generera receptet. Visa titel, ingredienser, steg och tillagningstid på receptskärmen (#129). Mängderna visas i ingredienslistan, inte i stegen (#135 är öppet).
4. Ett nytt förslag med samma val finns ännu inte (#28 är öppet).

### Frågor till läraren

<!-- Något ni vill ha feedback på eller är osäkra på? -->

-

## Del 2: Efter reviewn

### Feedback

-
-

### Ändringar i backloggen

<!-- Nya stories, ändrad prioritet, stories som tagits bort. Länka issues. -->

-
