# Sprint planning: sprint 1

**Datum:** 2026-11-09
**Deltagare:** Benjamin Simmons, Leo Spenner
**Product Owner denna sprint:** Benjamin
**Scrum Master denna sprint:** Leo

> **Status 2026-11-13:** Sprinten pågår. Listan och formuläret är implementerade på branchen `add-ingredient` och väntar på granskning/merge. Review och retro är planerade till 2026-11-16.

## Sprintmål

Användaren kan navigera mellan **Home** och **Råvaror**, se sitt matförråd från lokal SQLite och lägga till en råvara med namn, mängd och enhet.

## Kapacitet

Två utvecklare under en vecka (2026-11-09–2026-11-16). Sprinten är den första i projektet.

## Från förra retron

Sprint 1 är första sprinten; det finns ingen föregående retro.

## Valda stories

| Issue | Story | Storlek | Ansvarig |
|---|---|---|---|
| [#21](https://github.com/BnL-Studios/im-hungry/issues/21) | US-01 – Visa matförrådet | M | Benjamin |
| [#20](https://github.com/BnL-Studios/im-hungry/issues/20) | US-02 – Lägg till råvara | M | Leo |

**Totalt:** 0 S, 2 M, 0 L

## Risker och osäkerheter

- Listan och formuläret delar datalager och samma skärmar; samordna ändringar innan merge för att undvika konflikter.
- Receptflödet kräver Supabase Edge Function och AI-nyckel. Det är för stort för sprint 1 och ingår inte.
- Flödet behöver testas manuellt på både native och webb; SQLite och modal-beteende skiljer sig mellan plattformarna.
- Dokumentationen har släpat efter koden. Den ska uppdateras i samma PR som funktionen.

## Definition of Done

Se [Definition of Done](../../definition-of-done.md). En story räknas inte som klar förrän den är granskad och mergad till `main`.

**Senast uppdaterad:** 2026-11-13 (sprint 1).
