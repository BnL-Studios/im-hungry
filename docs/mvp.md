# MVP

## Användare

Studenter och unga vuxna som lagar mat hemma och ofta har några råvaror tillgängliga men svårt att komma på vad de ska laga. Den första versionen testas på **en enhet i taget**, utan personliga konton.

## Problem

Användaren har mat hemma men vet inte **vad hen kan laga av just de råvaror och mängder som finns tillgängliga**. Att leta efter recept manuellt tar tid och leder ofta till recept som kräver ytterligare inköp.

## Beskrivning

**I'm Hungry!** är en mobilapp där användaren registrerar sina råvaror och mängder i ett digitalt matförråd. Matförrådet sparas **lokalt i SQLite på telefonen** med Expo SQLite och Drizzle ORM och kan hanteras utan nätverk. Användaren väljer ett mat-humör och begär **ett** recept från AI. Då skickar appen bara den nödvändiga inventarielistan och humöret via HTTPS till en **Supabase Edge Function**, som validerar begäran och anropar AI med en hemlig nyckel som aldrig finns i mobilappen. Receptet visas i appen och sparas inte permanent i MVP:n.

## Ingår i MVP:n

- **Se matförrådet:** visa sparade råvaror med mängd och enhet; stöd för tom lista.
- **Lägga till råvaror:** ange namn, positiv mängd och enhet (t.ex. g, ml eller st); lagra lokalt i SQLite.
- **Korrigera matförrådet:** ändra mängd eller ta bort råvara med bestående ändringar.
- **Välja mat-humör:** ett litet urval, exempelvis *Comfort food*, *Quick & easy* och *Surprise me*.
- **Få ett recept med AI:** skicka det aktuella matförrådet och mat-humöret via Edge Function till AI och få **ett** recept utifrån enbart tillgängliga råvaror och mängder.
- **Läsa receptet:** visa titel, uppskattad tillagningstid, ingrediensmängder och steg; visa begripligt meddelande när nätet saknas eller giltigt recept inte kan erbjudas.

## Ingår inte i MVP:n

- Registrering, inloggning, kontoinställningar eller lösenordshantering.
- Synkronisering mellan enheter, delade hushåll eller automatisk molnbackup.
- Separat startsida/dashboard och avancerad navigering.
- Smart sökning, sortering, kategorier, streckkodsskanning och utgångsdatum.
- Flera receptförslag i följd, recepthistorik, favoriter och sparade recept.
- Starta matlagning, bekräfta tillagning eller automatiskt dra av ingredienser.
- Avancerade matpreferenser, portionsval, inköpslistor och näringsberäkning.
- Administratörsvy och rapporter.
- **Offline-generering av AI-recept.** Endast matförrådets CRUD fungerar utan internet.

**Teknisk säkerhetsförutsättning:** Innan Edge Function görs tillgänglig för bredare användning måste anropen skyddas mot missbruk och kostnadstoppar. AI-svar måste valideras mot det lokala matförrådet; mobilappen innehåller inga privata AI-nycklar.

## Ändringar

| Datum | Ändring | Varför |
|---|---|---|
| 2026-10-27 | Första MVP-avgränsningen enligt kursmallen. | Hålla kärnresan liten och vertikal. |
| 2026-11-02 | Lokal SQLite + Drizzle för matförråd, Supabase Edge Function för AI. | Offline-inventarie utan egen backend/databasserver och säker serverlagring av AI-nyckeln. |
