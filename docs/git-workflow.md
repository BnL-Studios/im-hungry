# Git-arbetsflöde

> **Snabbversion:** Vi använder **trunk-based development**. `main` ska alltid fungera. Varje kort får en kortlivad branch, ändringar går in via granskad pull request och vi använder **Squash and merge** som standard. Ingen mergar sin egen PR.

Det här dokumentet beskriver **hur** vi arbetar i Git och GitHub. [Gruppkontraktet](gruppkontrakt.md) beskriver ansvar och samarbete, [Definition of Done](definition-of-done.md) beskriver kvalitetskraven och [beslutsloggen](beslutslogg.md#beslut-05) beskriver **varför** vi valt arbetssättet.

## Översikt

```text
GitHub-kort → uppdaterad main → kortlivad branch → små commits
           → pull request → CI + granskning → Squash and merge till main
           → stäng kortet → ta bort branch
```

| Regel | Så gör vi |
|---|---|
| Huvudgren | `main` är vår enda långlivade gren och ska alltid fungera. |
| Direkta pushar | Vi pushar inte direkt till `main`. |
| Brancher | Skapas från uppdaterad `main`, en avgränsad uppgift per branch. |
| Livslängd | Helst timmar eller några dagar, **inte** en hel sprint. |
| PR | Liten och fokuserad, med koppling till ett GitHub-issue. |
| Granskning | Den andra teammedlemmen granskar inom **24 timmar**. |
| Merge | **Squash and merge** är standard. Den som skrivit PR:en mergar den **inte** själv. |
| CI | Bygg och tester ska vara gröna före merge. |

## 1. Välj ett kort och skapa en branch

Tilldela dig själv ett kort på vår [GitHub Project-board](https://github.com/orgs/BnL-Studios/projects/1). Kontrollera acceptanskriterier och eventuella beroenden.

Börja med att kontrollera arbetskatalogen. Spara eller lägg undan ocommittade ändringar **innan** du byter branch.

```bash
git status
git switch main
git pull --ff-only origin main
git switch -c feature/20-add-ingredient
```

Använd namnen `typ/issue-kort-beskrivning` när ett issue finns:

| Typ | Exempel |
|---|---|
| Ny funktion / user story | `feature/20-add-ingredient` |
| Felrättning | `fix/42-invalid-quantity` |
| Tekniskt arbete | `chore/ci-backend` |
| Dokumentation | `docs/git-workflow` |

Använd små bokstäver, bindestreck och inga å/ä/ö. Vi har ingen separat `develop`-branch.

## 2. Arbeta i små steg

Bygg en avgränsad del i taget. Kontrollera vad som har ändrats innan du committar:

```bash
git status
git diff
git add <fil>
git commit -m "feat: add ingredient form validation"
git push -u origin feature/20-add-ingredient
```

Byt `<fil>` och branchnamnet mot dina faktiska värden. Skriv tydliga, korta commit-meddelanden. Undvik att committa `.env`, API-nycklar, lösenord, byggfiler eller beroenden.

Synka ofta med `main`, särskilt före en PR:

```bash
# Stå i din feature-branch; se till att lokala ändringar är säkrade.
git fetch origin
git merge origin/main
```

Lös eventuella konflikter tillsammans med den som ändrat samma del. Starta appen och testa efteråt. Dela hellre stora stories i mindre levererbara delar än att hålla en branch öppen länge.

## 3. Öppna en pull request

Pusha din branch och öppna en PR mot **`main`**. Använd [PR-mallen](../.github/pull_request_template.md):

1. Beskriv **vad** ändringen gör och **hur** den testas.
2. Koppla PR:en till dess issue med exempelvis `Closes #20`. Då kan GitHub stänga kortet vid merge. Om PR:en bara är en del av arbetet, skriv hellre `Refs #20`.
3. Granska själv fliken **Files changed** och kontrollera [Definition of Done](definition-of-done.md).
4. Begär granskning från den **andra** teammedlemmen.

Gör PR:er så små att de går att läsa och testa utan lång väntetid. Om du behöver dela upp en story, se till att varje merge lämnar `main` fungerande.

## 4. CI och kodgranskning

GitHub Actions kör [CI-workflowen](../.github/workflows/ci.yml) automatiskt för PR:er till `main` och efter push till `main`.

**Just nu testar CI backend (Java 21 / Spring Boot / Maven)** mot en **tillfällig PostgreSQL-databas i GitHub Actions**, inte vår delade Supabase-databas. Frontend-kontroller läggs till när frontend-projektet finns.

**PR-författaren:**
- Ser till att CI blir grön och att acceptanskriterierna är testade.
- Rättar fel på samma branch och pushar igen.
- Begär ny granskning efter ändringar.

**Granskaren:**
- Granskar inom **24 timmar** enligt gruppkontraktet.
- Läser diffen, testar relevanta flöden och kontrollerar acceptanskriterier / DoD.
- Väljer **Approve** eller **Request changes**. En kommentar är inte samma sak som ett godkännande.
- Mergar först när granskningen är godkänd och CI passerar.

Om CI är röd: öppna fliken **Checks/Actions**, läs felet, rätta det på branchen och låt kontrollen köras igen. Försök inte gå runt kontrollen med en direkt push till `main`.

När CI är stabil ska statuskontrollen **Backend (Java 21)** också göras obligatorisk i GitHubs branch protection för `main`. Detta kräver en separat inställning i GitHub.

## 5. Squash and merge

Vi använder **Squash and merge** som standard: en färdig PR blir en sammanhållen commit på `main`, även om arbetet i branchen hade flera små commits.

1. Granskaren bekräftar att minst ett godkännande finns, att CI är grön och att PR:en kan mergas.
2. Granskaren väljer **Squash and merge** (inte vanlig merge som standard).
3. Skriv en tydlig slutlig commit-rubrik, exempelvis `feat: add ingredient to inventory (#20)`.
4. Verifiera att mergen lyckades, stäng/uppdatera kortet och ta bort fjärrbranchen.

Avvikelse från squash görs bara när teamet har ett tydligt skäl och kommer överens om det.

### Efter squash-merge

```bash
git switch main
git pull --ff-only origin main

# Ta bara bort den lokala branchen när PR:en är bekräftat mergad
# och du inte har något kvar där som behöver sparas.
git branch -D feature/20-add-ingredient
```

**Obs:** Efter squash-merge kan `git branch -d` neka borttagning eftersom branchens ursprungliga commits inte finns i `main` som samma commits. `-D` är därför avsiktligt här, **endast efter att mergen har verifierats**.

## 6. När något går fel

| Situation | Åtgärd |
|---|---|
| Konflikt mot `main` | Kör `git fetch origin` och `git merge origin/main` på din branch. Lös konflikter och testa igen. |
| CI misslyckas | Läs loggar, rätta och pusha. Merge först när testerna passerar. |
| Godkännande blev inaktuellt | Be den andra teammedlemmen granska de nya ändringarna igen. |
| En stor story tar för lång tid | Dela upp den i mindre, fungerande deländringar. |
| `main` går sönder efter merge | Meddela teamet omedelbart; prioritera att rätta eller återställa ändringen via PR. |
| En databasändring behövs | Samordna så att ni inte ändrar schemat parallellt; gör versionshanterade migrationer när de införs. |

## Ansvar och uppföljning

Det här dokumentet ändras när teamet beslutar att justera arbetssättet. Viktiga beslut dokumenteras även i [beslutsloggen](beslutslogg.md). På retrospektivet utvärderar vi bland annat PR-storlek, granskningshastighet, CI-fel och merge-konflikter.
