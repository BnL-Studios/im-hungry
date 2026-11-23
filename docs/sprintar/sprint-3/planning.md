# Sprint planning: sprint 3

**Datum:** 2026-11-23
**Deltagare:** Benjamin Simmons, Leo Spenner
**Product Owner denna sprint:** Benjamin
**Scrum Master denna sprint:** Leo

## Sprintmål

Från den nya receptknappen ska användaren kunna få ett recept som faktiskt går att laga med råvarorna hemma, och be om ett annat förslag utan att börja om.

## Kapacitet

Två utvecklare under veckan 2026-11-23–2026-11-27. Vi har redan ett fungerande AI-anrop från sprint 2, så den här sprinten handlar främst om att förbättra genereringen och hur användaren kommer åt den.

## Från förra retron

Inga åtgärder är inskrivna i sprint 2:s retro ännu.

## Valda stories

Arbetet kretsar kring receptgenereringen. US-07 (#28) är själva användarstoryn för att få ett annat recept; #145 är en del av det arbetet. Övriga kort gäller genereringsflödet och kvaliteten på svaren.

| Issue | Story/uppgift | Storlek | Ansvarig |
|---|---|---|---|
| [#28](https://github.com/BnL-Studios/im-hungry/issues/28) | US-07 – Få ett annat recept utan att börja om | – | Benjamin |
| [#143](https://github.com/BnL-Studios/im-hungry/issues/143) | Flytta generera recept till en modal med knapp i navigeringen | – | Ej satt |
| [#145](https://github.com/BnL-Studios/im-hungry/issues/145) | Försök generera ett annat recept när användaren trycker igen | – | Ej satt |
| [#146](https://github.com/BnL-Studios/im-hungry/issues/146) | AI:n ska kunna säga när råvarorna inte räcker till ett vettigt recept | – | Ej satt |
| [#147](https://github.com/BnL-Studios/im-hungry/issues/147) | Förbättra prompten så att AI:n föreslår mer realistiska recept | – | Ej satt |
| [#148](https://github.com/BnL-Studios/im-hungry/issues/148) | Se till att AI:n svarar konsekvent på rätt språk | – | Ej satt |

**Totalt:** 6 kort (1 user story och 5 arbetskort). Storlekar och återstående ansvariga fylls i efter att de bekräftats på boarden.

## Genomförande

- **Genereringsflödet:** Knappen för att skapa recept flyttas till mitten av navigeringen. Den öppnar en modal för genereringen och leder sedan vidare till receptet (#143).
- **Bättre recept:** Vi behöver justera prompten så att AI:n tänker mer som någon som faktiskt lagar mat. Saknas det råvaror för ett rimligt recept ska den säga det, inte hitta på något bara för att ge ett svar (#146, #147).
- **Generera igen:** Det ska gå att be om ett annat förslag utan att fylla i allt igen. Vi behöver också minska risken att samma recept bara kommer tillbaka (#28, #145).
- **Språk:** Testa blandade svenska och engelska råvarunamn. Språket i receptet ska inte bero på vilket språk ett enskilt ingrediensnamn råkar ha (#148).

## Risker och osäkerheter

- AI:n kan lämna ett svar som följer vårt API-kontrakt men ändå är ett dåligt recept. Vi behöver testa recepten med rimliga och orimliga kombinationer av råvaror.
- Samma lager kan ge samma recept flera gånger. Vi vet ännu inte hur mycket vi kan styra variationen, så vi behöver prova oss fram.
- Modalflödet och receptresultatet hänger ihop. Det behöver testas hela vägen i appen.
- Det är en del jobb för en vecka. Om allt inte blir klart prioriterar vi att huvudflödet fungerar ordentligt före extra förbättringar.

## Definition of Done

Se [Definition of Done](../../definition-of-done.md). En uppgift räknas inte som klar förrän den är granskad och mergad till `main`.

**Senast uppdaterad:** 2026-11-23.
