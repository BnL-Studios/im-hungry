# Sprint planning: sprint 3

**Datum:** 2026-11-23
**Period:** 2026-11-23–2026-11-27
**Deltagare:** Benjamin Simmons, Leo Spenner
**Product Owner denna sprint:** Benjamin (enligt rotationen, bekräftas på planning)
**Scrum Master denna sprint:** Leo (enligt rotationen, bekräftas på planning)

> **Läge 2026-11-23:** Det första AI-receptflödet är på plats. US-05 (#22), US-68 (#23) och US-67 (#24) stängdes i dag. #129 är fortfarande öppet. Nu fokuserar vi på hur receptflödet faktiskt fungerar för användaren, inte bara på att API-anropet går igenom.

## Sprintmål

Användaren ska kunna generera recept genom ett tydligare flöde och få mer rimliga och konsekventa AI-förslag på rätt språk, eller ett begripligt besked när råvarorna inte räcker.

## Kapacitet

- Två utvecklare under veckan 2026-11-23–2026-11-27. Eventuell frånvaro stäms av på planning.
- Vi bygger vidare på receptflödet från sprint 2 och håller ändringarna så små att vi hinner granska varandras PR:er.
- Sju kort är mycket för en vecka. Modalflödet och receptens kvalitet går före extra förbättringar om tiden blir knapp.

## Från förra retron

Sprint 2:s retro är ännu inte ifylld. Vi ska därför inte skriva in beslut som om mötet redan har hållits. Vi tar tills vidare med oss arbetssätten från sprint 1:

- Dokumentation uppdateras i samma PR som koden.
- Nya flöden testas på både native och webb.
- PR:erna hålls avgränsade och granskas av den andra i teamet.
- Standup loggas löpande, inte i efterhand.

## Valda stories och arbetskort

De nya korten #143 och #145–#148 samt US-07 (#28) hör till nästa steg i receptflödet. #129 är kvar från förra sprinten. Storlekar och ansvar där det inte framgår av GitHub är **förslag** och behöver bekräftas på boarden.

| Issue | Story/uppgift | Storlek (förslag) | Ansvarig |
|---|---|---|---|
| [#143](https://github.com/BnL-Studios/im-hungry/issues/143) | Öppna generera recept via en modal från mitten av navigeringen | M | Leo (förslag) |
| [#129](https://github.com/BnL-Studios/im-hungry/issues/129) | Färdigställ en tydlig skärm för det genererade receptet | M | Leo (förslag) |
| [#146](https://github.com/BnL-Studios/im-hungry/issues/146) | AI:n ska kunna säga när det inte går att laga något rimligt | M | Benjamin (förslag) |
| [#147](https://github.com/BnL-Studios/im-hungry/issues/147) | Få AI:n att föreslå bättre och mer realistiska recept | M | Benjamin (förslag) |
| [#148](https://github.com/BnL-Studios/im-hungry/issues/148) | Håll språket konsekvent i AI-svar och app | S | Benjamin (förslag) |
| [#28](https://github.com/BnL-Studios/im-hungry/issues/28) | US-07 – Be om ett annat recept utan att börja om | M | Benjamin |
| [#145](https://github.com/BnL-Studios/im-hungry/issues/145) | Förbättra omgenerering så att samma recept inte bara upprepas | S | Benjamin (förslag) |

**Totalt, preliminärt:** 2 S, 5 M, 0 L. #145 är arbete kopplat till US-07 (#28), inte en extra user story.

### Arbetsordning

1. **Leo:** #143 och #129. Knappen för att generera recept ska finnas i navigeringen, öppna en modal och sedan leda vidare till receptet.
2. **Benjamin:** #146 och #147. Förbättra AI-prompten och hanteringen av dåliga eller omöjliga förslag. Testa både ett rimligt matförråd och ett där det faktiskt inte går att laga något vettigt.
3. **Språk:** #148. Testa exempel med både svenska och engelska ingrediensnamn så att svaret inte byter språk på ett konstigt sätt.
4. **Omgenerering:** #28 och #145. Användaren ska kunna be om ett annat förslag med samma lager, utan att råvarorna ändras och utan att vi lovar att ett nytt rimligt recept alltid finns.

## Risker och osäkerheter

- **Omfattningen:** sju kort på fem dagar är mycket. Det som inte blir DoD-klart får flyttas vidare.
- **Receptkvaliteten:** ett svar kan följa JSON-kontraktet men ändå vara ett dåligt recept. Testa riktiga matlagningsfall, inte bara teknisk validering.
- **Variation:** Gemini kan ge samma recept igen. Vi behöver en tydlig strategi för #28/#145 och ett begripligt svar när inget annat fungerar.
- **Delade delar:** modal, receptvy och Edge Function påverkar varandra. Testa hela kedjan efter integration.
- **Säkerhet:** [#138](https://github.com/BnL-Studios/im-hungry/issues/138) (autentisering/rate limiting) är fortfarande öppet. Det är en känd risk med den publika MVP-funktionen men läggs inte automatiskt in i sprintmålet.

## Definition of Done

Se [Definition of Done](../../definition-of-done.md). Vi räknar bara sådant som är granskat, testat och mergat till `main` som klart.

**Senast uppdaterad:** 2026-11-23 (planning-underlag; storlekar, ansvar och exakta boardkolumner bekräftas tillsammans).
