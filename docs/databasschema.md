# Databasschema

> **Status:** Utkast baserat på Must-stories. Den faktiska tabellen och migrationerna är ännu inte implementerade. **SQLite finns på telefonen**, inte i Supabase.

## Diagram

![Databasschema](bilder/databasschema.png)

## Tabeller

| Tabell | Innehåll |
|---|---|
| `inventory_items` | Lokalt tillgängliga råvaror med namn, mängd och enhet. |

| Fält | SQLite-typ | Regel |
|---|---|---|
| `id` | `INTEGER` | Primärnyckel. |
| `name` | `TEXT` | Obligatoriskt råvarunamn. |
| `quantity` | `REAL` | Obligatorisk mängd större än 0. |
| `unit` | `TEXT` | Endast `g`, `ml` eller `quantity`. |

**Validering:** Drizzle ger typer och genererar SQL-migrationer, men korrekt indata måste också säkerställas med runtime-validering och SQLite-`CHECK`-begränsningar. Modellen kan vid implementationen utökas med till exempel tidsstämplar. Valet av `REAL` för mängder är preliminärt och kan omprövas om exakt decimalhantering krävs.

## Koppling till MVP

Ingen `users`-tabell behövs eftersom varje appinstallation har sitt eget matförråd. Recept genereras vid behov via en **Supabase Edge Function**, men recepten och AI-anropen kräver inte några nya SQLite-tabeller i MVP:n. Funktionen lagrar inte matförrådet i Supabase.

Vid implementationen blir `mobile/src/database/schema.ts` och versionshanterade Drizzle Kit-migrationer den tekniska sanningskällan. Uppdatera diagrammet när modellen ändras.
