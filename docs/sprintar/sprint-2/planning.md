# Sprint planning: sprint 2

<!--
  INSTRUKTION
  Fylls i på måndagen, efter retron. Ungefär 30 minuter.
  1. Titta på retrons åtgärder: påverkar de planeringen?
  2. Bestäm sprintmålet: en mening om vad sprinten ska ge, inte en lista med stories.
  3. Se över kapaciteten: är någon borta?
  4. Välj stories uppifrån i backloggen tills ni tror att ni har tillräckligt. Bara stories med acceptanskriterier.
  5. Sätt en ansvarig per story, och flytta dem till "Att göra" på boarden.
  Det är bättre att ta in för lite och plocka in mer än att ta in för mycket.
-->

**Datum:** 2026-11-16
**Deltagare:** Benjamin Simmons, Leo Spenner
**Product Owner denna sprint:** Leo Spenner
**Scrum Master denna sprint:** Benjamin Simmons

## Sprintmål

> Efter sprinten ska användaren kunna hålla matförrådet korrekt (ändra mängd/ta bort råvara) och påbörja/få ett första fungerande receptflöde från lagret: begära ett AI-förslag (US-05), läsa ett komplett recept (US-68) och förstå när inget giltigt recept kan erbjudas (US-67).

## Kapacitet

- Två utvecklare under veckan 2026-11-16–2026-11-20 (sprint 2).
- Inga kända frånvaroanmälningar vid planeringstillfället; uppdatera om något ändras.
- **Obs:** Omfattningen nedan är stor (inkl. en L-story och ny infrastruktur). Teamet kan behöva dela upp i mindre PR:er och flytta delar som inte blir klara till nästa sprint.

## Från förra retron

Åtgärder som tas med in i planeringen (preliminärt underlag från sprint 1-retro, att bekräfta på retron 2026-11-16):

- Uppdatera README/docs i samma PR som beteendet ändras. — *Ansvarig: den som äger PR:en*
- Logga standup varje dag, även kort. — *Ansvarig: alla*
- Testa nya flöden på både native och webb innan PR. — *Ansvarig: den som äger PR:en*
- Dela upp arbetet i små PR:er som kan granskas och mergas. — *Ansvarig: alla*

## Valda stories

Stories från Must-backloggen (inventory + receptflöde). Issue-nummer kopplas när GitHub-issues skapas/plockas in på boarden.

| Issue | Story | Storlek | Ansvarig |
|---|---|---|---|
| TBD | US-03 – Korrigera en mängd i matförrådet (Must, Inventory) | M | TBD |
| TBD | US-04 – Ta bort en råvara från matförrådet (Must, Inventory) | S | TBD |
| TBD | US-05 – Få ett grundläggande AI-recept från mitt matförråd (Must, Recipe discovery), inkl. relaterade delstories i flödet: US-68 och US-67 | L | TBD |
| TBD | US-68 – Läsa ett komplett recept i appen (Must, Recipe discovery) | S | TBD |
| TBD | US-67 – Förstå när inget giltigt recept kan erbjudas (Must, Recipe discovery) | M | TBD |

**Totalt:** 2 S, 2 M, 1 L

*Relaterat:* US-06 (välja mat-humör, Must, S) ingår i MVP-receptresan men är inte listad separat ovan — lägg till om teamet tar in den i sprinten.

*Notering om “sub-issues” till US-05:* I backloggen är receptflödet uppdelat i US-05 (generering), US-68 (presentation) och US-67 (fel/tomma/ogiltiga fall). Tillsammans täcker de den användbara vertikala kedjan för receptförslag.

## Risker och osäkerheter

- **Stor scope:** US-05 (L) + US-68 + US-67 är en stor vertikal leverans för en vecka; risk att allt inte hinner bli DoD-klart.
- **Ny infrastruktur:** receptflödet kräver troligen Supabase Edge Function, hantering av AI-nyckel på servern, anropsflöde från appen och validering av AI-svar mot lagret.
- **Kvalitet/säkerhet:** svar får inte föreslå recept som kräver mer/andra råvaror än lagret; fel och timeout ska ge tydliga meddelanden utan att ändra inventory.
- **Delat datalager/UI:** US-03/US-04 rör samma inventory-skärmar och repository som tidigare; samordna för att undvika mergekonflikter.
- **Validering:** samma regler som vid inmatning ska gälla vid ändring av mängd (mängd > 0, giltig enhet/mängdformat).
- **Beroenden:** US-68/US-67 bygger på att ett receptresultat/felresultat kan produceras och visas; planera implementation i rätt ordning.
