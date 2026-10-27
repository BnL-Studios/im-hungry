## Vad gör den här pull requesten?

<!-- Beskriv kort vad som ändras och varför. Håll PR:en avgränsad till en uppgift. -->

**Kopplat issue:** <!-- Skriv t.ex. Closes #20 när PR:en färdigställer hela kortet, annars Refs #20. -->

## Hur testar man ändringen?

<!-- Ge granskaren konkreta steg för att verifiera acceptanskriterierna. -->

1.
2.

## Checklista inför granskning

- [ ] Branchen utgår från uppdaterad `main` och PR:en har `main` som mål.
- [ ] Ändringen är avgränsad, och jag har läst min egen diff.
- [ ] Relevanta acceptanskriterier har testats manuellt.
- [ ] Backend/app bygger och befintliga tester passerar (inklusive GitHub Actions-CI).
- [ ] Ny backendlogik har relevant testtäckning enligt vår Definition of Done.
- [ ] Inga hemligheter, temporär felsökningskod eller oavsiktliga filer ingår.
- [ ] Databasschema ändras med en migrering om det är relevant.
- [ ] README/`docs/` är uppdaterade om arbetssätt eller användning påverkas.

Se hela vår [Definition of Done](https://github.com/BnL-Studios/im-hungry/blob/main/docs/definition-of-done.md) och [Git-arbetsflöde](https://github.com/BnL-Studios/im-hungry/blob/main/docs/git-workflow.md).

## Till granskaren

<!-- Fyll gärna på med frågor eller särskilda risker att granska. -->

- Granska mot acceptanskriterierna och Definition of Done.
- Kontrollera att CI är grön; begär ändringar om något behöver rättas.
- **Minst en annan teammedlem ska godkänna.**
- **PR-författaren mergar inte sin egen PR.** Granskaren använder normalt **Squash and merge** först efter godkännande och lyckade kontroller.
