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
git add mobile/src/features/inventory
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

## CI och mobilarkitekturen

CI-workflowen [`ci.yml`](../.github/workflows/ci.yml) kör på **Node 22** och gör följande vid PR och push till `main`:

1. `npm ci` i `mobile/`.
2. Validerar att `package.json` har `expo`/`expo-router` och att `app.json` är giltig JSON.
3. `npx tsc --noEmit`.
4. `npm test` (Vitest: validering, enheter och riktiga SQL-migrationer).

**Inga Supabase- eller Gemini-hemligheter krävs för mobilkontrollerna.** AI-gatewayen är inte byggd; när den byggs ska den testas separat med mockat AI-svar och säker konfiguration. Lint (`npm run lint`) körs lokalt men ingår inte i CI ännu.

**Branch protection:** PR #104 är mergad och legacy-Spring Boot är borttagen. CI-kontrollen heter **Mobile (Node 22)**. Om branch protection fortfarande kräver den gamla kontrollen **Backend (Java 21)** måste en GitHub-administratör byta till **Mobile (Node 22)**. Annars kan PR-merge blockeras trots grön ny CI. GitHub-inställningen uppdateras **inte** automatiskt av `ci.yml`.

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

**Senast uppdaterad:** 2026-11-13 (sprint 1).
