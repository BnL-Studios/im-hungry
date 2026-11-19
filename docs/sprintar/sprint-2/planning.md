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

> **Status 2026-11-17 (efter board-sortering och kodstatus):** Sprint 2 pågår 2026-11-16–2026-11-20. US-01/US-02 är klara sedan sprint 1 (#122, mergad). **Sprint Backlog har 8 kort:** #22, #125–#129, #23 och #24. #26, #27, #123 och #124 ligger på boarden i **In Progress** (alla Leo), men koden är implementerad lokalt (commit `f160032`) och väntar på PR/granskning. Product Backlog är ner till 68 kort.

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

Stories från Must-backloggen (inventory + receptflöde). Issue-nummer och ansvariga är hämtade från GitHub 2026-11-17; justera på planning om fördelningen ändras.

| Issue | Story | Storlek | Ansvarig |
|---|---|---|---|
| [#26](https://github.com/BnL-Studios/im-hungry/issues/26) | US-03 – Korrigera en mängd i matförrådet (Must, Inventory) | M | Leo |
| [#27](https://github.com/BnL-Studios/im-hungry/issues/27) | US-04 – Ta bort en råvara från matförrådet (Must, Inventory) | S | Leo |
| [#22](https://github.com/BnL-Studios/im-hungry/issues/22) | US-05 – Få ett grundläggande AI-recept från mitt matförråd (Must, Recipe discovery), inkl. delkort #125–#129 | L | Benjamin & Leo |
| [#23](https://github.com/BnL-Studios/im-hungry/issues/23) | US-68 – Läsa ett komplett recept i appen (Must, Recipe discovery) | S | TBD |
| [#24](https://github.com/BnL-Studios/im-hungry/issues/24) | US-67 – Förstå när inget giltigt recept kan erbjudas (Must, Recipe discovery) | M | TBD |

**Totalt:** 2 S, 2 M, 1 L (fem stories). US-05 är nedbruten i fem implementationskort nedan.

**Boardstatus 2026-11-17 (efter sortering):** #22, #125–#129, #23 och #24 ligger i **Sprint Backlog** (8 st). #26, #27, #123 och #124 ligger i **In Progress** (Leo). Product Backlog: 68 kort. Todo (#102/#103), Under Review (#19) och Done (27) är oförändrade.

### Sprintbacklog: konkreta kort

Receptflödet ligger som delkort under US-05 (#22). Korten nedan är de som faktiskt ligger i Sprint Backlog; ordningen speglar beroenden.

| Kort | Vad | Koppling | Ansvarig | Beror på | Boardstatus |
|---|---|---|---|---|---|
| [#22](https://github.com/BnL-Studios/im-hungry/issues/22) | US-05-epic: samlar receptflödet | US-05 | Benjamin & Leo | – | Sprint Backlog (0/5 delkort klara) |
| [#127](https://github.com/BnL-Studios/im-hungry/issues/127) | Välj AI-modell och sätt upp gratis API-prenumeration | US-05 | Benjamin | – | Sprint Backlog |
| [#125](https://github.com/BnL-Studios/im-hungry/issues/125) | Besluta och designa AI-implementationen (flöde, verktyg, svarsformat) | US-05 | Benjamin | #127 | Sprint Backlog |
| [#128](https://github.com/BnL-Studios/im-hungry/issues/128) | Koppla upp appen mot AI-API:t via Edge Function | US-05 | Benjamin | #125, #127 | Sprint Backlog |
| [#126](https://github.com/BnL-Studios/im-hungry/issues/126) | Skapa "generera recept"-sida med enkel knapp | US-05 | Benjamin | #125 | Sprint Backlog |
| [#129](https://github.com/BnL-Studios/im-hungry/issues/129) | Skapa receptskärm: titel, ingredienser och steg | US-68 | Leo | #128, #126 | Sprint Backlog |
| [#23](https://github.com/BnL-Studios/im-hungry/issues/23) | US-68 – läsa ett komplett recept (storykort; implementation i #129) | US-68 | Leo | #129 | Sprint Backlog (nyflyttad) |
| [#24](https://github.com/BnL-Studios/im-hungry/issues/24) | US-67 – förstå när inget giltigt recept kan erbjudas (implementation i PR för #126) | US-67 | Benjamin | #125, #128 | Sprint Backlog (nyflyttad, saknar delkort) |

### In Progress just nu (2026-11-17)

| Kort | Vad | Koppling | Ansvarig |
|---|---|---|---|
| [#26](https://github.com/BnL-Studios/im-hungry/issues/26) | US-03 – korrigera mängd | Sprintmål | Leo |
| [#27](https://github.com/BnL-Studios/im-hungry/issues/27) | US-04 – ta bort råvara | Sprintmål | Leo |
| [#123](https://github.com/BnL-Studios/im-hungry/issues/123) | Nummertangentbord för mängd i add-ingredient | US-02 (förbättring) | Leo |
| [#124](https://github.com/BnL-Studios/im-hungry/issues/124) | Extra enhetsknappar i add-ingredient | US-36 (Could) | Leo |

**Kodstatus 2026-11-17:** alla fyra kort är implementerade i koden — numeriskt tangentbord, skalor (mg/g/kg, ml/dl/L, st/dussin) som avrundas och sparas i basenheter, ändra mängd och borttagning med bekräftelse. Fyra Vitest-testfiler finns (validering, skalor, enheter, migrationer), CI kör nu `npm run lint`, typkontroll och tester. Inga nya PR:er eller branches är skapade utan tillåtelse.

**Kapacitetsrisk (uppdaterad):** koden för de fyra korten är klar men boardstatusen är kvar i In Progress tills PR/granskning är gjord. #123/#124 är förbättringar utanför sprintmålet; receptspåret är det stora återstående arbetet.

**Kvar att lösa:** #23 och #24 ligger nu i Sprint Backlog, men #24 saknar fortfarande ett eget implementationskort och #23 är inte explicit kopplad till #129 i GitHub. I förslaget nedan täcks #24 av PR:en för #126 och #23 av PR:en för #129 — bekräfta kopplingen eller skapa ett delkort för #24.

*MVP-ändring 2026-11-19:* US-06 (välja mat-humör) flyttas till **Should/efter MVP**. Den ingår inte i sprint 2:s receptbegäran, som skickar endast ingredienslistan och returnerar `title`, `ingredients`, `steps` och `estimatedCookingTime`. Se [kontrakt v1](../../ai-integration.md).

*Notering om "sub-issues" till US-05:* I backloggen är receptflödet uppdelat i US-05 (generering), US-68 (presentation) och US-67 (fel/tomma/ogiltiga fall). Tillsammans täcker de den användbara vertikala kedjan för receptförslag.

## Risker och osäkerheter

- **Stor scope:** fem kort för receptflödet plus två inventory-stories och två sidokort på fem dagar för två utvecklare. US-03/US-04 och sidokorten är implementerade i koden; om AI-spåret drar ut på tiden flyttas receptdelar till sprint 3.
- **AI-modell vald 2026-11-19, konto återstår:** `gemini-3.8-flash` är primär och `gemini-3.5-flash-lite` reserv enligt [AI-designen](../../ai-integration.md). #125 är dokumenterad och väntar på review/merge. #127 är **inte** färdig förrän teamets API-nyckel, modellåtkomst och verkliga gratiskvot har verifierats. #128 är ännu inte byggd.
- **Ny infrastruktur:** ingen `supabase/`-kod finns ännu. Det förenklade JSON-kontraktet (**enbart `ingredients` in, fyra fält ut**) och valideringsregler finns i [AI-designen](../../ai-integration.md); Edge Function, hemlig AI-nyckel och verklig integration återstår i #127/#128.
- **Kvalitet/säkerhet:** svar får inte föreslå recept som kräver mer/andra råvaror än lagret. #125 definierar schema, inventory-ID och summakontroll i [AI-designen](../../ai-integration.md); implementation och tester återstår.
- **Fyra kort hos Leo (koden klar):** #26, #27, #123 och #124 ligger kvar i In Progress på boarden men väntar på granskning. #123/#124 är förbättringar utanför sprintmålet.
- **US-67 utan delkort:** #24 ligger nu i Sprint Backlog men har inget implementationskort. Fel-, timeout- och tomt-lager-flöden riskerar att bli bortglömda; lägg dem explicit i PR:en för #126 (eller skapa ett delkort).
- **Delat datalager/UI:** US-03/US-04 rör samma inventory-skärmar och repository som tidigare; samordna för att undvika mergekonflikter.
- **Validering:** samma regler som vid inmatning ska gälla vid ändring av mängd (mängd > 0, giltig enhet/mängdformat).
- **Beroenden:** #127 → #125 → #128 → (#126, #129). #23 stängs av #129; #24 av #126 (fel/timeout/tomt lager) och bygger på att #128 kan producera ett felresultat.

## Förslag: PR-indelning och fördelning

Ursprungligt förslag från planning 2026-11-17. **Status 2026-11-19:** PR #130 för inventory finns och en separat dokumentationsbranch `docs/ai-design-model-decision` har skapats för #125; detta avsnitt är alltså en historisk plan, inte aktuell lista över öppna PR:er. Enligt DoD granskas och mergas varje PR av den andra teammedlemmen.

| Ord | Branch / PR | Stänger | Ansvarig | Reviewer | Beror på |
|---|---|---|---|---|---|
| 1 | `fix/add-ingredient-input` | #123, #124 | Leo | Benjamin | – (redan i In Progress) |
| 2 | `feat/edit-ingredient-amount` | #26 | Leo | Benjamin | 1 (valfritt) |
| 3 | `feat/remove-ingredient` | #27 | Leo | Benjamin | 2 |
| 4 | `docs/ai-design-model-decision` | #125 (design); #127 modellval, men inte konto/setup | Benjamin | Leo | – |
| 5 | `feat/generate-recipe-api` | #128 | Benjamin | Leo | 4 |
| 6 | `feat/generate-recipe-screen` | #126, #24 | Benjamin | Leo | 5 (UI kan mockas efter 4) |
| 7 | `feat/recipe-detail` | #129, #23 | Leo | Benjamin | 5, 6 |

- **Fördelning:** Leo tar inventory-spåret + receptskärmen (4 PR:er, #123/#124 bundlade). Benjamin tar AI-grunden, API:t och generera-sidan inkl. US-67 (3 PR:er).
- **PR 4:** modellval, gratisnivå/rate limits, svarsformat och secret-setup i Supabase. API-nyckeln commitas aldrig.
- **PR 6:** fel-, timeout- och tomt-lager-lägen ligger i samma PR som genereringsknappen. Vill ni ha #24 som egen PR måste ett delkort skapas först.
- **PR 2/3:** samma `repository.ts` och `IngredientsScreen.tsx` — gör dem sekventiellt.
- **Fallback:** #123/#124 är nu implementerade tillsammans med #26/#27 i samma lokala kod; om granskningen drar ut på tiden prioriteras inventory-PR:erna före receptspåret.

**Uppföljning 2026-11-19:** Exakt Gemini-modell och [API-kontrakt v1](../../ai-integration.md) (ingredienser in; titel, ingredienser, steg, uppskattad tid ut) är dokumenterade för #125 och väntar på PR-granskning. #127 har modellbeslut men **nyckel, projektaccess och gratiskvot är inte verifierade**. #128/#126/#129 saknar implementerad AI-integration. Inventory-arbetet ligger i öppna PR #130. Sprintmålet ska inte markeras som uppfyllt enbart på basis av designen.

**Senast uppdaterad:** 2026-11-19 (uppföljning till ursprunglig planning 2026-11-17).
