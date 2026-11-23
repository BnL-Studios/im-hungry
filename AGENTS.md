This repository contains an Expo/React Native mobile application in `mobile/`. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `mobile/package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Run these from `mobile/`. Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx vitest run              # tests
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint, typecheck and tests before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `mobile/src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Git-hantering och PR-sammanfattning vid avslutad task

- **Ingen automatisk push eller PR:** Kör aldrig `git push` och skapa aldrig en Pull Request automatiskt. Utvecklaren granskar alltid diffen, pushar och öppnar PR manuellt.
- **Obligatorisk PR-mall i chatten:** När en implementation eller buggfix är klar och verifierad ska ditt allra sista stycke i chatten vara ett kopieringsbart `markdown`-kodblock med projektets PR-mall färdigifylld utifrån ändringarna som gjorts.
- **Regler för ifyllnad:**
  - **Vad gör den här pull requesten?:** Sammanfatta ändringen konkret i 2–4 korta punktlistor.
  - **Kopplat issue:** Hämta issue-nummer från branchnamnet (t.ex. `feat/126-129-...` -> `#126, #129`) eller användarens prompt. Skriv `#<issue-nr>` om det saknas.
  - **Hur testar man ändringen?:** Skriv numrerade, konkreta steg för hur granskaren testar flödet i appen eller via terminalen.
  - **Checklista inför granskning:** Markera endast `[x]` på punkter du faktiskt har verifierat i sessionen (t.ex. lokala tester/lint/typecheck, inga hemligheter, uppdaterad dokumentation). Lämna punkter som kräver manuell kontroll av författaren (t.ex. *jag har läst min egen diff*, *testats manuellt* eller *GitHub Actions-CI*) som `[ ]`.

Använd exakt denna struktur i det avslutande kodblocket:

```markdown
## Vad gör den här pull requesten?

- <Konkret av sammanfattning ändringen>

**Kopplat issue:** #<issue-nr>

## Hur testar man ändringen?

1. <Steg 1>
2. <Steg 2>

## Checklista inför granskning

- [ ] Branchen utgår från uppdaterad `main` och PR:en har `main` som mål.
- [ ] Ändringen är avgränsad, och jag har läst min egen diff.
- [ ] Relevanta acceptanskriterier har testats manuellt.
- [ ] Mobilappens CI och relevanta tester passerar (inklusive GitHub Actions-CI).
- [ ] Ny eller ändrad logik har relevant testtäckning enligt vår Definition of Done.
- [ ] Inga hemligheter, temporär felsökningskod eller oavsiktliga filer ingår.
- [ ] Lokal SQLite-modell uppdateras med Drizzle-schema och migration när det är relevant.
- [ ] README/`docs/` är uppdaterade om arbetssätt eller användning påverkas.

Se hela vår [Definition of Done](https://github.com/BnL-Studios/im-hungry/blob/main/docs/definition-of-done.md) och [Git-arbetsflöde](https://github.com/BnL-Studios/im-hungry/blob/main/docs/git-workflow.md).

## Till granskaren

- Granska mot acceptanskriterierna och Definition of Done.
- Kontrollera att CI är grön; begär ändringar om något behöver rättas.
- **Minst en annan teammedlem ska godkänna.**
- **PR-författaren mergar inte sin egen PR.** Granskaren använder normalt **Squash and merge** först efter godkännande och lyckade kontroller.
```

# Globala kodregler
- Läs ALDRIG hela mappstrukturer eller node_modules/target/build. Använd riktade sökningar.
- Svara kortfattat och koncist. Skippa långa förklaringar om jag inte uttryckligen ber om det.
- Vid ändringar i befintliga filer, redigera endast berörda funktioner – skriv inte om hela filer i onödan.
- Vid Git-kommandon, föreslå korta, beskrivande Conventional Commits (t.ex. `feat:`, `fix:`).

## Kontext- och tokenvänligt arbetssätt

- Läs bara filer du ska ändra eller som direkt blockerar uppgiften. Använd riktade sökningar och `read` med `offset`/`limit` i stället för att bläddra i hela projektet.
- Sök efter ett befintligt mönster eller en hjälpfunktion innan du skapar en ny; återanvänd hellre än duplicerar.
- Gör små, lokala ändringar. Lämna omgivande kod, formatering och kommentarer orörda.
- Samla oberoende sökningar och filäsningar i parallella anrop när det går.
- Skriv inte ut hela filer eller stora utdrag i svaret. Sammanfatta vad som ändrats och vilka kontroller som körts.
- Kör `npx tsc --noEmit`, `npx expo lint` och `npx vitest run` innan du säger att uppgiften är klar. Rapportera bara relevanta fel och radnummer.
- Nya Expo Router-routes kan ge tillfälliga typfel i `.expo/types/router.d.ts` tills dev-servern startats; starta Expo eller använd `RelativePathString` i stället för att gissa nya href-typer.
