# MVP

## Användare

Studenter och unga vuxna som lagar mat hemma och ofta har några råvaror tillgängliga men svårt att komma på vad de ska laga. Den första versionen testas på **en enhet i taget**, utan personliga konton.

## Problem

Användaren har mat hemma men vet inte **vad hen kan laga av just de råvaror och mängder som finns tillgängliga**. Att leta efter recept manuellt tar tid och leder ofta till recept som kräver ytterligare inköp.

## Beskrivning

**I'm Hungry!** är en mobilapp där användaren registrerar sina råvaror och mängder i ett digitalt matförråd. Matförrådet sparas **lokalt i SQLite på telefonen** med Expo SQLite och Drizzle ORM och kan hanteras utan nätverk. Användaren begär **ett** recept från AI genom att skicka **endast inventariets ingredienslista** (ID, namn, mängd, basenhet) via HTTPS till en **Supabase Edge Function**, som validerar begäran och anropar AI med en hemlig nyckel som aldrig finns i mobilappen. Vid framgång kommer exakt fyra fält tillbaka: receptnamn (`title`), använda råvaror (`ingredients`), tillagningssteg (`steps`) och uppskattad tid i minuter (`estimatedCookingTime`). Receptet visas i appen och sparas inte permanent i MVP:n.

## Status (uppföljt 2026-11-23)

Sprint 1 avslutades 2026-11-16 och sprint 2 2026-11-20. Hela MVP-kedjan finns nu på `main` (`b6e14b6`); matförrådets första del kom via #122 och resten via #130, #140, #141 och #142:

| Område | Status |
|---|---|
| Se matförrådet (US-01) | Klar: listan läser från lokal SQLite, visar tomt läge och fel (mergad via #122). |
| Lägga till råvara (US-02) | Klar: modal, validering och sparning via det delade inventory-lagret (mergad via #122). |
| Korrigera/ta bort (US-03/US-04) | Klar: implementerat och mergat via #130/#141. |
| Mat-humör (US-06) | **Efter MVP**; påverkar inte API-request v1. |
| Recept via Edge Function/AI (US-05 m.fl.) | Kod och deployment klara (#140, #141, #142); [kontrakt v1](ai-integration.md) delas mellan mobil och server. **Riktigt AI-anrop, secret-namn och modellval återstår att verifiera.** |
| Resultat och fel (US-67/US-68) | Receptvy, laddning, tomt lager och felmeddelanden finns på Home; boardkorten #23/#24/#129 är ännu öppna. |

Se [sprint 2](sprintar/sprint-2/planning.md), [arkitekturen](arkitektur.md) och [AI-integrationsdesignen](ai-integration.md).

## Ingår i MVP:n

- **Se matförrådet:** visa sparade råvaror med mängd och enhet; stöd för tom lista.
- **Lägga till råvaror:** ange namn, positiv mängd och enhet (t.ex. g, ml eller styck); lagra lokalt i SQLite.
- **Korrigera matförrådet:** ändra mängd eller ta bort råvara med bestående ändringar.
- **Få ett recept med AI:** skicka **enbart ingredienslistan** via Edge Function och få **ett** recept utifrån tillgängliga råvaror och mängder.
- **Läsa receptet:** visa titel, uppskattad tillagningstid, ingrediensmängder och steg; visa begripligt meddelande när nätet saknas eller giltigt recept inte kan erbjudas.

## Ingår inte i MVP:n

- Registrering, inloggning, kontoinställningar eller lösenordshantering.
- Synkronisering mellan enheter, delade hushåll eller automatisk molnbackup.
- Separat startsida/dashboard och avancerad navigering.
- Smart sökning, sortering, kategorier, streckkodsskanning och utgångsdatum.
- Flera receptförslag i följd, recepthistorik, favoriter och sparade recept.
- Starta matlagning, bekräfta tillagning eller automatiskt dra av ingredienser.
- Mat-humör (US-06), val av kök, avancerade matpreferenser, portionsval, inköpslistor och näringsberäkning.
- Administratörsvy och rapporter.
- **Offline-generering av AI-recept.** Endast matförrådets CRUD fungerar utan internet.

**Teknisk säkerhetsförutsättning:** Edge Function är deployad men saknar ännu missbruksskydd (#138). Begränsa exponeringen tills auth/rate limiting och kostnadskvoter finns. AI-svar valideras mot det lokala matförrådet; mobilappen innehåller inga privata AI-nycklar.

## Ändringar

| Datum | Ändring | Varför |
|---|---|---|
| 2026-10-27 | Första MVP-avgränsningen enligt kursmallen. | Hålla kärnresan liten och vertikal. |
| 2026-11-02 | Lokal SQLite + Drizzle för matförråd, Supabase Edge Function för AI. | Offline-inventarie utan egen backend/databasserver och säker serverlagring av AI-nyckeln. |
| 2026-11-13 | Sprint 1-status tillagd; US-01/US-02 implementerade, receptflödet kvar. | Dokumentationen ska spegla faktiskt läge i sprint 1. |
| 2026-11-16 | Sprint 2-status: US-01/US-02 mergade via #122; US-03/US-04 och receptflödet (#22, #23, #24) pågår. | Dokumentationen ska spegla faktiskt läge i sprint 2. |
| 2026-11-19 | Status för PR #130 och AI-val/kontrakt (#125/#127) förtydligad. | Skilj beslutad design från implementerad funktion. |
| 2026-11-19 | MVP-kontrakt förenklat till ingredients-in och fyra receptfält ut. US-06 skjuts upp. | Kortare vertikal leverans utan preferenser. |
| 2026-11-23 | Status uppdaterad: hela receptflödet implementerat och deployat (#140–#142); riktigt AI-anrop och modell/secret-konfiguration kvar att verifiera. | Dokumentationen ska spegla `main` i stället för tidigare planer. |
