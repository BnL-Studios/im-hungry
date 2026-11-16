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

> **Status 2026-11-16:** Sprint 1 avslutas i dag. US-01 och US-02 är mergade till `main` via PR #122. Sprint 2 pågår 2026-11-16–2026-11-20; receptflödet är nedbrutet i korten #125–#129 och ingen sprint 2-kod är påbörjad ännu.

## Sprintmål

> Efter sprinten ska användaren kunna hålla matförrådet korrekt (ändra mängd/ta bort råvara) och påbörja/få ett första fungerande receptflöde från lagret: begära ett AI-förslag (US-05), läsa ett komplett recept (US-68) och förstå när inget giltigt recept kan erbjudas (US-67).

## Kapacitet

- Två utvecklare under veckan 2026-11-16–2026-11-20 (sprint 2).
- Inga kända frånvaroanmälningar vid planeringstillfället; uppdatera om något ändras.
- Sprint 1 levererade US-01/US-02 (2 M) enligt plan. Sprint 2 tar in 2 S + 2 M + 1 L, varav US-05 redan är nedbruten i fem kort (#125–#129).
- **Obs:** Omfattningen är fortfarande stor (receptflöde med ny infrastruktur). Leverera inventory-delarna (#26/#27) tidigt och flytta receptdelar som inte blir DoD-klara till sprint 3 i stället för att stressa igenom dem.

## Från förra retron

Åtgärder som tas med in i planeringen (preliminärt underlag från sprint 1-retro, att bekräfta på retron 2026-11-16):

- Uppdatera README/docs i samma PR som beteendet ändras. — *Ansvarig: den som äger PR:en*
- Logga standup varje dag, även kort. — *Ansvarig: alla*
- Testa nya flöden på både native och webb innan PR. — *Ansvarig: den som äger PR:en*
- Dela upp arbetet i små PR:er som kan granskas och mergas. — *Ansvarig: alla*

## Valda stories

Stories från Must-backloggen (inventory + receptflöde). Issue-nummer och ansvariga är hämtade från GitHub 2026-11-16; justera på planning om fördelningen ändras.

| Issue | Story | Storlek | Ansvarig |
|---|---|---|---|
| [#26](https://github.com/BnL-Studios/im-hungry/issues/26) | US-03 – Korrigera en mängd i matförrådet (Must, Inventory) | M | Leo |
| [#27](https://github.com/BnL-Studios/im-hungry/issues/27) | US-04 – Ta bort en råvara från matförrådet (Must, Inventory) | S | Leo |
| [#22](https://github.com/BnL-Studios/im-hungry/issues/22) | US-05 – Få ett grundläggande AI-recept från mitt matförråd (Must, Recipe discovery), inkl. delkort #125–#129 | L | Benjamin & Leo |
| [#23](https://github.com/BnL-Studios/im-hungry/issues/23) | US-68 – Läsa ett komplett recept i appen (Must, Recipe discovery) | S | TBD |
| [#24](https://github.com/BnL-Studios/im-hungry/issues/24) | US-67 – Förstå när inget giltigt recept kan erbjudas (Must, Recipe discovery) | M | TBD |

**Totalt:** 2 S, 2 M, 1 L (fem stories). US-05 är nedbruten i fem implementationskort nedan.

### Sprintbacklog: konkreta kort

Receptflödet ligger som delkort under US-05 (#22). Ordningen speglar beroenden; korten ska flyttas till "Att göra" på boarden med ansvarig.

| Kort | Vad | Koppling | Ansvarig | Beror på |
|---|---|---|---|---|
| [#127](https://github.com/BnL-Studios/im-hungry/issues/127) | Välj AI-modell och sätt upp gratis API-prenumeration | US-05 | Benjamin & Leo | – |
| [#125](https://github.com/BnL-Studios/im-hungry/issues/125) | Besluta och designa AI-implementationen (flöde, verktyg, svarsformat) | US-05 | Benjamin & Leo | #127 |
| [#128](https://github.com/BnL-Studios/im-hungry/issues/128) | Koppla upp appen mot AI-API:t via Edge Function | US-05 | Benjamin & Leo | #125, #127 |
| [#126](https://github.com/BnL-Studios/im-hungry/issues/126) | Skapa "generera recept"-sida med enkel knapp | US-05 | TBD | #125 |
| [#129](https://github.com/BnL-Studios/im-hungry/issues/129) | Skapa receptskärm: titel, ingredienser och steg | US-68 | TBD | #128 |

**Saknas på boarden:** US-67 (#24) har inget implementationskort och ingen ansvarig. Skapa och fördela ett kort för fel-, timeout- och tomt-lager-lägen innan #128 blir klar, eftersom acceptanskriterierna 2–5 kräver det. US-03/US-04 har issues men inga delkort.

**Öppna kort utanför sprintmålet:** [#123](https://github.com/BnL-Studios/im-hungry/issues/123) (nummertangentbord för mängd, US-02) och [#124](https://github.com/BnL-Studios/im-hungry/issues/124) (extra enhetsknappar, kopplar mot US-36/Could). Båda är assignade till Leo men ingår inte i sprintmålet — bekräfta på planning/boarden om de ska in i sprinten, annars ligger de kvar i backloggen.

*Relaterat:* US-06 (välja mat-humör, Must, S) ingår i MVP-receptresan men är inte listad separat ovan — lägg till om teamet tar in den i sprinten.

*Notering om "sub-issues" till US-05:* I backloggen är receptflödet uppdelat i US-05 (generering), US-68 (presentation) och US-67 (fel/tomma/ogiltiga fall). Tillsammans täcker de den användbara vertikala kedjan för receptförslag.

## Risker och osäkerheter

- **Stor scope:** fem kort för receptflödet plus två inventory-stories på fem dagar för två utvecklare. Om AI-spåret drar ut på tiden: leverera US-03/US-04 först och flytta receptdelar till sprint 3.
- **AI-valet är inte gjort:** #127 (leverantör, gratisnivå, rate limits) blockerar #125 och #128. Beslutet behövs tidigt i veckan.
- **Ny infrastruktur:** ingen `supabase/`-kod finns ännu. Edge Function, hemlig AI-nyckel och svarsformat mellan app och funktion måste tas fram i #125/#128.
- **Kvalitet/säkerhet:** svar får inte föreslå recept som kräver mer/andra råvaror än lagret. Definiera svarsformat och toleranser i #125, och validera AI-svaret mot inventory innan det visas.
- **US-67 utan kort/ägare:** fel-, timeout- och tomt-lager-flöden riskerar att bli bortglömda. Skapa kortet tidigt.
- **Delat datalager/UI:** US-03/US-04 rör samma inventory-skärmar och repository som tidigare; samordna för att undvika mergekonflikter.
- **Validering:** samma regler som vid inmatning ska gälla vid ändring av mängd (mängd > 0, giltig enhet/mängdformat).
- **Beroenden:** #127 → #125 → #128 → #129. #126 kan gå parallellt efter #125. US-67 bygger på att #128 kan producera ett felresultat.

**Senast uppdaterad:** 2026-11-16 (issue-nummer, ansvariga och sprintbacklog uppdaterade).
