# Sprintar

Varje sprint får en egen mapp med fyra filer.

## Sprintar i projektet

| Sprint | Period | Status | Dokument |
|---|---|---|---|
| Sprint 1 | 2026-11-09–2026-11-16 | Avslutad; review och retro finns som underlag | [planning](sprint-1/planning.md) · [standup](sprint-1/standup.md) · [review](sprint-1/review.md) · [retro](sprint-1/retro.md) |
| Sprint 2 | 2026-11-16–2026-11-20 | Kod levererad; review och retro behöver kompletteras efter mötena | [planning](sprint-2/planning.md) · [standup](sprint-2/standup.md) · [review](sprint-2/review.md) · [retro](sprint-2/retro.md) |
| Sprint 3 | 2026-11-23–2026-11-27 | Pågår; planning-underlag klart | [planning](sprint-3/planning.md) · [standup](sprint-3/standup.md) · [review](sprint-3/review.md) · [retro](sprint-3/retro.md) |

`sprint-mall/` är generiska mallar och ska inte fyllas i direkt. Sprint 3 handlar om modalflödet (#143), receptvyn (#129), AI-kvalitet och språk (#146–#148) samt ett nytt receptförslag utan att börja om (US-07, #28 och #145). Se [planning](sprint-3/planning.md) för detaljer.

## Så gör vi vid varje ny sprint

1. Kopiera `sprint-mall/` och döp mappen till rätt sprintnummer.
2. Fyll i `planning.md` på måndagen. Kontrollera storlekar och ansvar mot GitHub-boarden.
3. Logga `standup.md` kort varje dag.
4. Fyll i `review.md` inför reviewn med läraren och komplettera med resultat och feedback efteråt.
5. Fyll i `retro.md` tillsammans efter reviewn.

Gör dokumentändringar i en egen branch och PR, precis som med kod.

## Måndagens ordning

```text
Review (föregående sprint) → Retro (föregående sprint) → Planning (nästa sprint)
```

Retron ligger före nästa planning så att det vi kommer överens om kan påverka nästa sprint.

## Filerna

| Fil | När | Vem |
|---|---|---|
| `planning.md` | Måndag, i början av sprinten | Hela teamet, PO leder |
| `standup.md` | Varje dag | Alla skriver sin egen rad |
| `review.md` | Före och efter reviewn | Hela teamet |
| `retro.md` | Direkt efter reviewn | Hela teamet, SM leder |
