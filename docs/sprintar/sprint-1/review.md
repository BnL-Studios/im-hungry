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

**Datum:** 2026-11-09 (planerat reviewdatum)  
**Deltagare:** Benjamin Simmons, Leo Spenner och läraren (planerat)

## Del 1: Förberedelse

### Sprintmål

Att användaren ska kunna **se sitt matförråd och lägga till råvaror i mobilappen**. Detta är en sammanfattning av de två stories som valdes i sprintplaneringen; sprintmålet är inte slutligt formulerat i `planning.md`.

**Uppnåddes sprintmålet?** **Delvis.** Benjamin har byggt delen för att visa matförrådet (US-01) och Leo har byggt delen för att lägga till en råvara (US-02), men lösningarna ligger ännu inte tillsammans i `main`. Navigering mellan vyerna, integration av kod och anslutningen till den lokala databasen återstår. Därför är hela användarflödet och dess acceptanskriterier ännu inte klara.

### Blev klart

| Issue | Story | Visas av |
|---|---|---|
| – | Inga av sprintens två user stories är ännu klara enligt Definition of Done och mergade till `main`. | – |

**Färdigutvecklade delar som ännu inte räknas som klara stories:**

- **Benjamin:** Implementerat arbetet för att visa matförrådet (UI-delen av [US-01 / #21](https://github.com/BnL-Studios/im-hungry/issues/21)) i sin egen utveckling.
- **Leo:** Implementerat arbetet för att lägga till råvaror (UI-delen av [US-02 / #20](https://github.com/BnL-Studios/im-hungry/issues/20)) i sin egen utveckling.
- **På `main`:** Expo-grundprojekt samt SQLite-/Drizzle-uppsättning med schema och migrationshantering. Denna infrastruktur är ett färdigt tekniskt delsteg, inte en färdig inventariefunktion.

### Blev inte klart

| Issue | Story | Varför inte klar | Vad händer med den? |
|---|---|---|---|
| [#21](https://github.com/BnL-Studios/im-hungry/issues/21) | US-01 – Visa matförrådet (Benjamin) | Koden är ännu inte integrerad och mergad. Inventarievyn behöver kopplas till SQLite/Drizzle. | Sammanföra bådas kod, skapa navigering till matförrådet, ansluta vyn till databasen, testa acceptanskriterierna och öppna/granska PR. |
| [#20](https://github.com/BnL-Studios/im-hungry/issues/20) | US-02 – Lägg till råvara (Leo) | Koden är ännu inte integrerad och mergad. Inventarievyn behöver kopplas till SQLite/Drizzle. | Sammanföra bådas kod, koppla formuläret till databasen och inventarievyn, testa giltig/ogiltig inmatning och persistens, öppna/granska PR. |

**Gemensamt kvarvarande arbete:** Flytta/anpassa och sammanföra de två kodlösningarna, skapa appens navigation/tabbar, koppla båda funktionerna till samma SQLite-datalager och testa hela användarresan. Först därefter kan de två stories markeras som klara enligt acceptanskriterier och Definition of Done. Vi har ännu inte skapat PR:er för dessa två funktioner.

### Demoplan

<!-- Visa en faktisk användarresa med det som finns i main. Ingen omergad funktion presenteras som klar. -->

1. Visa appen som den är på main branchen nu; app index med en hello world, som visar app struckturen fungerar och är set up.

### Frågor till läraren

- 

## Del 2: Efter reviewn

### Feedback

> **Exempel:** Läraren frågade hur man vet vem som ska göra nästa disk. I deras kollektiv turas man om varje vecka i stället för att tilldela.

-
-

### Ändringar i backloggen

<!-- Nya stories, ändrad prioritet, stories som tagits bort. Länka issues. -->

> **Exempel:** Ny story #15 "Turordning per vecka" som Must. "Tilldela en syssla" (#5) sänks till Should.

-
