# MVP

## Användare

Studenter och unga vuxna som lagar mat hemma och ofta har några råvaror tillgängliga men svårt att komma på vad de ska laga. Den första versionen testas av en person åt gången, utan personliga konton.

## Problem

Användaren har mat hemma men vet inte **vad hen kan laga av just de råvaror och mängder som finns tillgängliga**. Att leta efter recept manuellt tar tid och leder ofta till recept som kräver ytterligare inköp.

## Beskrivning

**I'm Hungry!** är en mobilapp där användaren registrerar sina råvaror och mängder i ett enkelt digitalt matförråd, väljer ett grundläggande mat-humör och får **ett AI-genererat recept** som går att laga med det som finns hemma. Appen visar receptets ingredienser och tillagningssteg. Matförrådet sparas i en databas via en backend så att informationen finns kvar när appen öppnas igen.

## Ingår i MVP:n

- **Se matförrådet:** visa en enkel lista över sparade råvaror med mängd och enhet, även när listan är tom.
- **Lägga till råvaror:** ange namn, positiv mängd och enhet (t.ex. g, ml eller st) och spara via backend till databas.
- **Korrigera matförrådet:** ändra en registrerad mängd eller ta bort en råvara, med bestående ändringar.
- **Välja mat-humör:** ett litet fördefinierat urval, exempelvis *Comfort food*, *Quick & easy* och *Surprise me*.
- **Få ett recept med AI:** skicka aktuellt matförråd och valt humör till AI via backend och föreslå **ett** recept utifrån enbart tillgängliga råvaror och mängder.
- **Läsa receptet:** visa titel, uppskattad tillagningstid, ingrediensmängder och tydliga steg; visa ett begripligt meddelande om recept inte kan tas fram.

## Ingår inte i MVP:n

- Registrering, inloggning, automatisk inloggning, kontoinställningar och lösenordshantering (MVP:n använder en avgränsad testprofil, inte ett publikt delat konto).
- En separat startsida/dashboard och avancerad navigering.
- Smart sökning, sortering, kategorier, automatisk igenkänning av vanliga varor, streckkodsskanning och utgångsdatum.
- Fler receptförslag i följd, receptsamlingar, favoriter och historik.
- Starta matlagning, markera recept som tillagat och automatiskt dra av använda ingredienser.
- Avancerade matpreferenser: kök/stil, allergier, ogillade råvaror eller rätter, portionsval och egna instruktioner.
- Inköpslistor, måltidsplanering, notiser och näringsberäkning.
- Administratörsvy, användarstatistik, rapporter och delade hushåll.

## Ändringar

| Datum | Ändring | Varför |
|---|---|---|
| 2026-10-27 | Första versionen enligt kursens MVP-mall. | Avgränsa projektet till den minsta fungerande användarresan och kunna testa kärnnyttan under sprint 2–3. |
