# Retrospektiv: sprint 1

**Datum:** 2026-11-16 (planerat)
**Deltagare:** Benjamin Simmons, Leo Spenner
**Leds av:** Leo (Scrum Master)

> **Status:** Retron är inte genomförd ännu. Underlaget nedan är preliminära observationer och ska beslutas tillsammans på retron.

## Förra retrons åtgärder

Sprint 1 är första sprinten; det finns inga tidigare åtgärder att följa upp.

## Vad gick bra?

- Vi fick en vertikal del på plats på branchen `add-ingredient`: lista från SQLite, formulär, validering och lokal persistens.
- Det delade inventory-lagret (`validation.ts`, `units.ts`, `repository.ts`) återanvänds i stället för att dupliceras i skärmarna.
- Två riktiga SQL-migrationer med `CHECK`-begränsningar och tester som kör dem mot SQLite.
- CI kör typkontroll och tester, och webbstöd för SQLite kom på plats.

## Vad gick mindre bra?

- Dokumentationen släpade efter koden; README beskrev fortfarande tomma mappar och tester som inte fanns.
- Preview-data låg kvar i listan efter att SQLite var på plats, vilket gjorde att funktionen såg klarare ut än den var.
- PR #119 blev liggande och innehöll gammal, redan mergad historik; den fick stängas utan merge.
- Knappen `+ Lägg till` blev osynlig på grund av style-merge i `Link asChild`; felet hittades sent.
- Dagliga standuper loggades inte, så sprintdokumentationen fick rekonstrueras i efterhand.

## Åtgärder till nästa sprint

| Åtgärd | Ansvarig |
|---|---|
| Uppdatera README/docs i samma PR som beteendet ändras. | Den som äger PR:en |
| Logga standup varje dag, även kort. | Alla |
| Testa nya flöden på både native och webb innan PR. | Den som äger PR:en |
| Stäng eller uppdatera gamla branches i stället för att låta dem ligga. | Alla |
| Dela upp arbetet i små PR:er som var och en kan granskas och mergas. | Alla |

## Ändringar i Definition of Done eller gruppkontrakt

Inga beslutade ändringar ännu. Frågan tas på retron.

**Senast uppdaterad:** 2026-11-13 (förberedelse inför retron).
