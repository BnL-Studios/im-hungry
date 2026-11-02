# Git-arbetsflöde

> **Snabbversion:** Trunk-Based Development. `main` ska alltid fungera. Vi skapar små kortlivade branches, använder PR-granskning och **Squash and merge** som standard. Ingen mergar sin egen PR.

Se [gruppkontrakt](gruppkontrakt.md), [Definition of Done](definition-of-done.md), [beslutslogg](beslutslogg.md#beslut-05) och [GitHub-boarden](https://github.com/orgs/BnL-Studios/projects/1).

## Från kort till färdig ändring

1. Välj ett kort på boarden och ta ansvar för det.
2. Börja från den senaste `main` och skapa en branch, t.ex. `feature/20-add-ingredient`, `fix/42-invalid-quantity` eller `docs/sqlite-architecture`.
3. Gör små commits och synka regelbundet med `main`.
4. Kontrollera ändringen lokalt och öppna en PR mot `main`. Skriv `Closes #20` om hela kortet löses, annars `Refs #20`.
5. Granska egen diff, fyll i PR-mallen och be den andra teammedlemmen granska inom 24 timmar.
6. Låt CI gå igenom; åtgärda eventuella fel och begär ny granskning efter ändringar.
7. När granskningen är godkänd och CI är grön: **granskaren** väljer normalt **Squash and merge** och tar bort fjärrbranchen.
8. Uppdatera boarden, hämta senaste `main` och börja på nästa kort.

## Exempelkommandon

```bash
git status
git switch main
git pull --ff-only origin main
git switch -c feature/20-add-ingredient
# ... arbeta ...
git diff
git add app/src/features/inventory
git commit -m "feat: add ingredient persistence"
git push -u origin feature/20-add-ingredient
```

Före PR: 

```bash
git fetch origin
git merge origin/main  # kör från feature-branchen
```

Efter verifierad squash-merge (och **bara** när branchen inte innehåller kvarvarande arbete):

```bash
git switch main
git pull --ff-only origin main
git branch -D feature/20-add-ingredient
```

Vid squash-merge kan `git branch -d` neka borttagning eftersom branchcommits inte finns identiska i `main`; `-D` får användas **endast när mergen verifierats**.

## CI och den nya mobilarkitekturen

Mål: GitHub Actions installerar beroenden i `app/`, kör TypeScript-kontroll och därefter lämpliga enhetstester samt databastester när dessa finns. **Inga Supabase- eller Gemini-hemligheter krävs för vanliga mobilkontroller.** AI-gatewayen testas separat med mockat AI-svar och säker konfiguration.

**Övergång:** Den fjärrlagrade `main` hade vid kontroll fortfarande `backend/` och statuskontrollen **Backend (Java 21)**. Om den är obligatorisk under branch protection måste en GitHub-administratör **först ersätta** den med **Mobile (Node 22)** när den nya kontrollen körts grönt, och därefter ta bort legacy-jobbet och backend-koden. Annars blockeras PR-merge. Inställningen i GitHub uppdateras **inte** automatiskt genom att ändra `ci.yml`.

## Kodgranskning

- Kontrollera user story och acceptanskriterierna.
- Prova ändringen på relevant mobilplattform och läs koden, särskilt dataflöden och migrationsändringar.
- Validera offlinebeteende för matförråd och nätverks-/AI-fel för receptflödet.
- Kontrollera att inga privata API-nycklar ligger i mobildelen.
- Skriv konkreta kommentarer; använd **Approve** eller **Request changes**. Kommentarer ensamma räknas inte som godkännande.

## Om något går fel

| Problem | Åtgärd |
|---|---|
| Konflikt mot `main` | Hämta senaste `main`, lös konflikten i branchen och testa igen. |
| CI misslyckas | Läs GitHub Actions-loggen, rätta på branchen och pusha igen. |
| Migrationskonflikt | Samordna schemaändringar; granska ordning och testuppgraderingar. |
| Ändringen växer | Dela i mindre fungerande vertikala delar. |
| `main` går sönder | Informera teamet och prioritera en fix eller revert via PR. |

Följ upp branchlivslängd, väntetid på PR-granskning och CI-problem vid retrospektivet.
