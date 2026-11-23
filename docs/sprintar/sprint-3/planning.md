# Sprint planning: sprint 3

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

**Datum:**
**Deltagare:**
**Product Owner denna sprint:**
**Scrum Master denna sprint:**

## Sprintmål

<!-- En mening. Vad ska vara möjligt efter sprinten som inte var det innan? -->

> Efter sprinten ska användaren kunna få ett recept från matförrådet som passar valt mat-humör, kök, maxtid och antal portioner, se mängderna direkt i receptstegen och be om ett annat förslag med samma val.

## Kapacitet

<!-- Är någon borta eller har mindre tid den här veckan? -->

Sprintveckan är 23–27 november. Tillgänglig tid per person är inte dokumenterad.

## Från förra retron

<!-- Vilka åtgärder från förra retron tar vi med oss in i sprinten? -->

I [sprint 2:s retro](../sprint-2/retro.md) är tabellen för åtgärder till nästa sprint tom.

## Valda stories

<!-- Länka issues med #nummer. Storlek: S, M eller L. -->

Så låg korten på [boarden](https://github.com/orgs/BnL-Studios/projects/1) den 23 november. Ett streck betyder att fältet är tomt.

### Sprint Backlog

| Issue | Story | Storlek | Ansvarig |
|---|---|---|---|
| [#25](https://github.com/BnL-Studios/im-hungry/issues/25) | US-06 – Välja mat-humör | S | SimmoM8 |
| [#28](https://github.com/BnL-Studios/im-hungry/issues/28) | US-07 – Be om ett annat receptförslag | S | SimmoM8 |
| [#29](https://github.com/BnL-Studios/im-hungry/issues/29) | US-26 – Välja kök eller matstil | S | – |
| [#30](https://github.com/BnL-Studios/im-hungry/issues/30) | US-27 – Sätta en maxtid för matlagningen | M | – |
| [#31](https://github.com/BnL-Studios/im-hungry/issues/31) | US-28 – Välja antal portioner | M | – |
| [#135](https://github.com/BnL-Studios/im-hungry/issues/135) | Visa mängd och enhet i receptstegen så att användaren slipper scrolla | – | – |

### In Progress

| Issue | Story | Storlek | Ansvarig |
|---|---|---|---|
| [#143](https://github.com/BnL-Studios/im-hungry/issues/143) | Öppna en modal för att generera recept | – | – |
| [#129](https://github.com/BnL-Studios/im-hungry/issues/129) | Visa receptet från AI:n på en egen skärm | – | – |

**Totalt:** 3 S, 2 M, 0 L. Tre kort saknar storlek.
<!-- Jämför med förra sprinten: hur mycket blev klart då? -->

## Risker och osäkerheter

<!-- Något ni inte vet hur man gör? Beroenden mellan stories? -->

- [API-kontrakt v1](../../ai-integration.md) tar bara emot råvaror. Hur ska mat-humör, kök, maxtid och antal portioner följa med från receptmodalen?

## Definition of Done

Se [Definition of Done](../../definition-of-done.md).
