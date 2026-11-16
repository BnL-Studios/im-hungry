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

> Efter sprinten ska en användare kunna hålla sitt matförråd korrekt genom att ändra mängd på en sparad råvara och ta bort råvaror som inte längre finns hemma.

## Kapacitet

- Två utvecklare under veckan 2026-11-16–2026-11-20 (sprint 2).
- Inga kända frånvaroanmälningar vid planeringstillfället; uppdatera om något ändras.

## Från förra retron

Åtgärder som tas med in i planeringen (preliminärt underlag från sprint 1-retro, att bekräfta på retron 2026-11-16):

- Uppdatera README/docs i samma PR som beteendet ändras. — *Ansvarig: den som äger PR:en*
- Logga standup varje dag, även kort. — *Ansvarig: alla*
- Testa nya flöden på både native och webb innan PR. — *Ansvarig: den som äger PR:en*
- Dela upp arbetet i små PR:er som kan granskas och mergas. — *Ansvarig: alla*

## Valda stories

Stories valda uppifrån Must-backloggen efter US-01/US-02 (inventory-CRUD). Issue-nummer kopplas när GitHub-issues skapas/plockas in på boarden.

| Issue | Story | Storlek | Ansvarig |
|---|---|---|---|
| TBD | US-03 – Korrigera en mängd i matförrådet (Must, Inventory) | M | TBD |
| TBD | US-04 – Ta bort en råvara från matförrådet (Must, Inventory) | S | TBD |

**Totalt:** 1 S, 1 M, 0 L

*Jämförelse:* Sprint 1 planerade 2 M (US-01, US-02). Den här sprinten tar in något mindre omfattning (1 M + 1 S) för att lämna utrymme för granskning, test på native/webb och dokumentation.

## Risker och osäkerheter

- **Delat datalager/UI:** ändring och borttagning rör samma inventory-skärmar och repository som US-01/US-02; samordna för att undvika mergekonflikter.
- **Borttagning:** behöver tydligt bekräftelseflöde och hantering av fel så att lagret inte hamnar i felaktigt läge.
- **Validering:** samma regler som vid inmatning ska gälla vid ändring (mängd > 0, giltig enhet/mängdformat).
- **Nästa steg efter CRUD (ej denna sprint):** US-06 (mat-humör) och receptflödet US-05/US-68/US-67 kräver bland annat Supabase Edge Function, AI-nyckel och validering av AI-svar — planeras separat när inventariet är stabilt.
