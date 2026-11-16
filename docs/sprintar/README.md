# Sprintar

Varje sprint får en egen mapp med fyra filer.

## Sprintar i projektet

| Sprint | Period | Status | Dokument |
|---|---|---|---|
| Sprint 1 | 2026-11-09 – 2026-11-16 | **Pågår/avslutas** (review & retro 2026-11-16) | [planning](sprint-1/planning.md) · [standup](sprint-1/standup.md) · [review](sprint-1/review.md) · [retro](sprint-1/retro.md) |
| Sprint 2 | 2026-11-16 – 2026-11-20 | **Planerad** (vecka upplagd) | [planning](sprint-2/planning.md) · [standup](sprint-2/standup.md) · [review](sprint-2/review.md) · [retro](sprint-2/retro.md) |

`sprint-mall/` är generiska mallar och ska inte fyllas i; kopiera mallen till nästa sprintmapp. Sprint 2-dokumenten är förberedda utifrån sprint 1 och aktuell backlog (US-03/US-04 samt receptflödet US-05, US-68, US-67); uppdatera issue-nummer, ansvariga och dagliga standups löpande.

## Så gör ni vid varje ny sprint

1. Kopiera mappen `sprint-mall/` och döp kopian till nästa lediga sprintnummer, t.ex. `sprint-2/`.
2. Fyll i `planning.md` under sprint planning på måndagen.
3. Fyll i `standup.md` varje dag.
4. Fyll i `review.md` inför reviewn med läraren, och komplettera efteråt med feedbacken.
5. Fyll i `retro.md` direkt efter reviewn.

Gör det här i en egen branch och pull request, precis som med kod.

## Måndagens ordning

```
Review (sprint N)  →  Retro (sprint N)  →  Planning (sprint N+1)
```

Retron ligger före planeringen, så att det ni bestämmer på retron påverkar nästa sprint direkt.

## Filerna

| Fil | När | Vem |
|---|---|---|
| `planning.md` | Måndag, i början av sprinten | Hela teamet, PO leder |
| `standup.md` | Varje dag | Alla skriver sin egen rad |
| `review.md` | Före och efter reviewn | Hela teamet |
| `retro.md` | Måndag, direkt efter reviewn | Hela teamet, SM leder |
