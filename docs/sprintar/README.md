# Sprintar

Varje sprint får en egen mapp med fyra filer.

## Sprintar i projektet

| Sprint | Period | Status | Dokument |
|---|---|---|---|
| Sprint 1 | 2026-11-09–2026-11-16 | Avslutad | [planning](sprint-1/planning.md) · [standup](sprint-1/standup.md) · [review](sprint-1/review.md) · [retro](sprint-1/retro.md) |
| Sprint 2 | 2026-11-16–2026-11-20 | Avslutad; review/retro behöver kompletteras | [planning](sprint-2/planning.md) · [standup](sprint-2/standup.md) · [review](sprint-2/review.md) · [retro](sprint-2/retro.md) |
| Sprint 3 | 2026-11-23–2026-11-27 | Pågår | [planning](sprint-3/planning.md) · [standup](sprint-3/standup.md) · [review](sprint-3/review.md) · [retro](sprint-3/retro.md) |

`sprint-mall/` innehåller mallarna för en ny sprint. Sprint 3 handlar om genereringsflödet (#143), bättre AI-recept (#146–#148) och att kunna få ett annat förslag (US-07, #28 och #145). Se [sprint 3 planning](sprint-3/planning.md).

## Så gör ni vid varje ny sprint

1. Kopiera `sprint-mall/` till nästa sprintmapp.
2. Fyll i `planning.md` på måndagen.
3. Logga kort i `standup.md` varje dag.
4. Fyll i `review.md` inför reviewn med läraren och komplettera efteråt.
5. Fyll i `retro.md` efter reviewn.

Gör dokumentändringarna i en egen branch och pull request, precis som med kod.

## Måndagens ordning

```text
Review (sprint N) → Retro (sprint N) → Planning (sprint N+1)
```

## Filerna

| Fil | När | Vem |
|---|---|---|
| `planning.md` | I början av sprinten | Hela teamet, PO leder |
| `standup.md` | Varje dag | Alla skriver sin egen rad |
| `review.md` | Före och efter reviewn | Hela teamet |
| `retro.md` | Direkt efter reviewn | Hela teamet, SM leder |
