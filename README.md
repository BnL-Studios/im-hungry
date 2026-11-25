# I'm Hungry!

**Från råvaror till middag.** I'm Hungry! är en mobilapp som ska hjälpa hemmakockar att hålla koll på vad de har hemma och få AI-genererade receptförslag utifrån tillgängliga råvaror och mängder.

Projektet byggs av **BnL Studios** inom en Scrum-kurs. Det är under utveckling, inte en färdig app.

> **Aktuellt läge (2026-11-25):** Appen är en React Native-app med Expo och TypeScript. Matförrådet lagras **lokalt på telefonen** med **SQLite och Drizzle ORM**. Fliken **Råvaror** kan visa, lägga till, ändra mängd och ta bort råvaror. Första inventarieflödet mergades via PR #122; US-03/US-04, numeriskt tangentbord och skalor (mg/g/kg, ml/dl/L, st/dussin) är implementerade. Receptflödet finns i kod på branchen `screen-and-page-for-generate-recipe`: fliken **Generate Recipe** öppnar en modal, och ett lyckat recept visas på en egen `/recipe`-skärm. GitHub-issuesen #143/#129 är fortfarande öppna tills PR:en är granskad och mergad. Supabase används inte som matförrådsdatabas.

## Mål och MVP

Målgrupp: studenter och andra som ofta har råvaror hemma men svårt att bestämma vad de kan laga med just de mängderna.

| Ingår i MVP:n | Hur det ska fungera | Status (2026-11-25) |
|---|---|---|
| Matförråd | Visa, lägga till, korrigera och ta bort råvaror med mängd och enhet. | Implementerat (US-01–US-04). Skalor räknas om till basenheterna g/ml/st. |
| Lokal lagring | Inventariet finns kvar efter omstart och kan hanteras utan internet. | Implementerat med Expo SQLite + Drizzle. |
| Ett receptförslag | Skicka en begäran till Edge Function och visa ett AI-genererat recept utifrån råvarorna som finns. | Implementerat på branchen; Edge Function anropar Gemini. Issue/PR-status separat. |
| Resultat och fel | Visa recepttitel, tid, ingredienser, mängder och steg, eller ett begripligt felmeddelande. | Implementerat på branchen med egen receptskärm och tydliga fel/empty-states. |

Utanför MVP:n: mat-humör, val av kök, användarkonton, molnsynkronisering, favoriter, recepthistorik, automatiska avdrag ur matförrådet, avancerade preferenser, inköpslistor och streckkodsskanning. **Inventariet fungerar offline; receptgenerering kräver internet.** Lokal data synkroniseras inte mellan enheter och kan förloras vid avinstallation.

Se [MVP](docs/mvp.md), [Product Backlog](docs/USER_STORIES.md), [sprint 1](docs/sprintar/sprint-1/planning.md), [sprint 2](docs/sprintar/sprint-2/planning.md), [sprint 3](docs/sprintar/README.md) och [AI-integrationsdesignen](docs/ai-integration.md).

## Teknik och arkitektur

| Del | Val | Status |
|---|---|---|
| Mobilapp | React Native, Expo SDK 58, TypeScript och Expo Router | Implementerad i `mobile/` |
| Navigation | Tre flikar: Hem, Generate Recipe och Råvaror; `add-ingredient`, `edit-ingredient`, `/generate-recipe` och `/recipe` | Implementerad |
| Lokal databas | Expo SQLite | Implementerad |
| ORM och migrationer | Drizzle ORM + Drizzle Kit | Implementerade; två migrationer |
| Matförrådets UI | Lista från SQLite, lägga till/ändra/ta bort, skalor, validering och fel/empty-state | Implementerat (PR #122 + sprint 2) |
| Recept-gateway | Supabase Edge Functions (Deno/TypeScript); [API-kontrakt v1](docs/ai-integration.md) med endast ingredienslista in och fyra receptfält ut | Implementerad i `supabase/functions/generate-recipe/` |
| AI-tjänst | `gemini-3.5-flash-lite` som kodstandard; `GEMINI_MODEL`/`GEMINI_BACKUP_MODEL` kan sätta annan primär/reservmodell | Implementerad; hemligheten är `GEMINI_API` |
| Test | Vitest: validering, skalor, enheter, migrationer, receptkontrakt och view-model | Implementerat; 6 testfiler / 34 tester |
| CI | GitHub Actions för mobilapp och Edge Function | `npm ci`, Expo-konfiguration, lint, typkontroll, Vitest och `deno test` |
| Process | Scrum, trunk-based development, granskade PR:er, squash merge | Dokumenterat |

```mermaid
flowchart TD
    subgraph Phone[Användarens telefon]
      App[Expo / React Native UI]
      Logic[features/inventory: validering och hooks]
      DB[(Lokal SQLite)]
      App --> Logic --> DB
    end
    App -->|"HTTPS vid receptbegäran"| Edge[Supabase Edge Function]
    Edge -->|"GEMINI_API som serverhemlighet"| AI[Gemini - standard gemini-3.5-flash-lite]
    AI -->|"strukturerat recept"| Edge
    Edge -->|"validerat svar"| App
```

Hela flödet finns i kod på feature-branchen; heldragna pilar är implementerade.

**Viktig säkerhetsgräns:** API-nyckeln ligger bara som hemlighet (`GEMINI_API`) i Edge Function, aldrig i appen. Funktionens indata och AI-svar valideras. Utan användarinloggning behöver en publik Edge Function dessutom begränsa missbruk och kostnader (t.ex. rate limiting, kvoter och övervakning) innan den görs publikt tillgänglig. Klienten kontrollerar receptets mängder mot sitt lokala inventarie; funktionens begäran är inte bevis för vad som faktiskt är lagrat på telefonen.

Läs [arkitekturen och dataintegritet](docs/arkitektur.md), [databasschemat](docs/databasschema.md) och [beslutsloggen](docs/beslutslogg.md).

## Kom igång

**Krav:** Git, Node.js 22 eller senare och npm samt simulator/emulator eller mobil med stöd för Expo. Projektet har en `package-lock.json`, så använd `npm ci` för reproducerbar installation. Migrationstestet använder `node:sqlite`, som kräver Node 22+.

```bash
git clone https://github.com/BnL-Studios/im-hungry.git
cd im-hungry/mobile
npm ci
npx expo start
```

Välj i Expo-terminalen om du vill köra i simulator, emulator eller på en telefon. Beroende på vilka native-moduler som tillkommer kan en **development build** behövas. Se [Expo-dokumentationen](https://docs.expo.dev/get-started/start-developing/).

## Testning och CI

Kör från `mobile/`:

```bash
npx tsc --noEmit       # typkontroll
npm test               # Vitest: validering, enheter och migrationer
npm run lint           # ESLint via expo lint
npx expo-doctor        # kontrollera beroenden och konfiguration
```

Testfilerna ligger i `mobile/src/features/`:

- `inventory/validation.test.ts` testar inmatningsreglerna, decimaler vid redigering och avrundning (300 mg → 0,3 g).
- `inventory/scales.test.ts` testar skalornas omvandling till basenheter och flyttalsavrundning.
- `inventory/units.test.ts` testar enheter och formatering.
- `inventory/migrations.test.ts` kör de riktiga SQL-migrationerna mot en temporär SQLite-databas och kontrollerar att `CHECK`-begränsningarna stoppar ogiltiga rader.
- `recipes/generate.test.ts` testar snapshot/re-check och felmeddelanden.
- `recipes/view-model.test.ts` testar att receptvyn bara visar råvaror med giltigt namn och positiv mängd.

[GitHub Actions-CI](.github/workflows/ci.yml) installerar beroenden, validerar Expo-konfigurationen, kör lint, typkontroll och Vitest för mobilappen samt `deno test` för Edge Function vid PR och push till `main`.

**Branch protection:** CI-kontrollen heter **Mobile (Node 22)**. Om branch protection fortfarande kräver den gamla kontrollen **Backend (Java 21)** måste en GitHub-administratör byta till **Mobile (Node 22)** efter första gröna körningen. Detta sker inte automatiskt.

[GitHub Actions](https://github.com/BnL-Studios/im-hungry/actions) · [Git-arbetsflöde](docs/git-workflow.md)

## Aktuellt läge

Sprint 2 är avslutad (2026-11-16–2026-11-20); sprint 3 pågår (2026-11-23–2026-11-27). Det som är klart i koden:

- Flikarna Hem, Generate Recipe och Råvaror; `add-ingredient`, `edit-ingredient`, `/generate-recipe` och `/recipe` används som routes/modaler.
- Startsidan visar **Im hungry** och tre korta instruktionssteg.
- Råvarulistan läser från lokal SQLite via Drizzle och `useLiveQuery`.
- **Lägg till råvara** använder numeriskt tangentbord och en skalväljare som sparar basenheter (g/ml/st).
- **Ändra mängd** (US-03) och **ta bort råvara** med bekräftelse (US-04).
- Två Drizzle-migrationer med `CHECK`-begränsningar för positiv mängd och tillåtna enheter.
- Sex Vitest-testfiler (34 tester): validering, skalor, enheter, migrationer, receptgenerering och receptvy.
- CI kör lint, typkontroll, Vitest och `deno test`; appen är låst till ljust läge.

Det som återstår:

- PR-granskning/merge för #143 och #129 samt manuell kontroll av CI och publicerad miljö.
- #135: mängder ska flyttas in i tillagningsstegen så man inte behöver skrolla fram och tillbaka. Mat-humör skjuts upp till efter MVP.
- Missbruksskydd/rate limiting innan Edge Function exponeras bredare (#138).

**Legacy:** Spring Boot-koden är borttagen. Ingen Java-server eller molndatabas behövs för matförrådet i målarkitekturen.

## Projektstruktur

```text
im-hungry/
├── mobile/                          # Expo-mobilapp
│   ├── app.json
│   ├── package.json
│   ├── drizzle/                     # Genererade SQL-migrationer + metadata
│   ├── src/
│   │   ├── app/                     # Routes (Expo Router)
│   │   │   ├── _layout.tsx          # Rot-Stack + DatabaseProvider + RecipeProvider
│   │   │   ├── add-ingredient.tsx   # Modal route
│   │   │   ├── edit-ingredient.tsx  # Modal route
│   │   │   ├── generate-recipe.tsx  # Tunn modal route
│   │   │   ├── recipe.tsx           # Tunn receptroute
│   │   │   └── (tabs)/
│   │   │       ├── _layout.tsx      # Hem + Generate Recipe + Råvaror
│   │   │       ├── index.tsx        # Hem: rubrik och instruktioner
│   │   │       ├── generate.tsx     # Web-fallback till modalen
│   │   │       └── ingredients/
│   │   │           └── index.tsx    # Tunn route till IngredientsScreen
│   │   ├── screens/                 # Skärmkomponenter
│   │   │   ├── IngredientsScreen.tsx
│   │   │   ├── AddIngredientScreen.tsx
│   │   │   ├── EditIngredientScreen.tsx
│   │   │   ├── GenerateRecipeModalScreen.tsx
│   │   │   └── GeneratedRecipeScreen.tsx
│   │   ├── features/inventory/      # Enheter, skalor, validering, repository + tester
│   │   ├── features/recipes/        # generate, context, view-model + tester
│   │   └── db/                      # Drizzle-schema, client, provider
│   └── ...
├── docs/
│   ├── arkitektur.md                # Lokal SQLite + implementerad Edge Function
│   ├── databasschema.md             # Databasschema (SQLite)
│   ├── databasschema.dbml           # Redigerbar DBML
│   ├── mvp.md
│   ├── USER_STORIES.md
│   ├── beslutslogg.md
│   ├── definition-of-done.md
│   ├── git-workflow.md
│   ├── gruppkontrakt.md
│   ├── sprintar/
│   └── reflektioner/
├── .github/
│   ├── workflows/ci.yml
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
└── README.md
```

**Var kod hamnar:** `mobile/src/app/` innehåller endast routes; varje fil där blir en skärm. `mobile/src/screens/` har skärmkomponenter, `mobile/src/features/` domän- och datalager, `mobile/src/db/` Drizzle-schema och databasprovider, och `mobile/drizzle/` de genererade migrationerna. `supabase/functions/generate-recipe/` innehåller Deno-funktionen som anropar Gemini.

## Team och arbetsflöde

| Namn | GitHub |
|---|---|
| Benjamin Simmons | [@SimmoM8](https://github.com/SimmoM8) |
| Leo Spenner | [@spennerr](https://github.com/spennerr) |

Vi använder kortlivade branches från `main`, pull requests, minst en annan persons godkännande, och **Squash and merge** som standard. Enligt [gruppkontraktet](docs/gruppkontrakt.md) granskar vi PR:er inom 24 timmar och mergar inte våra egna PR:er.

[GitHub Project-board](https://github.com/orgs/BnL-Studios/projects/1) · [Issues](https://github.com/BnL-Studios/im-hungry/issues) · [Pull requests](https://github.com/BnL-Studios/im-hungry/pulls)

## Dokumentation

| Dokument | Syfte |
|---|---|
| [MVP](docs/mvp.md) | Omfattning och avgränsningar |
| [Product Backlog](docs/USER_STORIES.md) | User stories och acceptanskriterier |
| [Arkitektur](docs/arkitektur.md) | Ansvar, dataflöden, AI-gateway och säkerhet |
| [AI-integrationsdesign](docs/ai-integration.md) | Modellval, ingredients-request, fyra receptfält, felkoder, validering och implementeringsstatus |
| [Databasschema](docs/databasschema.md) · [DBML](docs/databasschema.dbml) | Lokal SQLite-modell |
| [Beslutslogg](docs/beslutslogg.md) | Tidigare och gällande teknikbeslut |
| [Git-arbetsflöde](docs/git-workflow.md) | Branches, PR, CI och squash merge |
| [Definition of Done](docs/definition-of-done.md) | Kvalitetskrav per story |
| [Gruppkontrakt](docs/gruppkontrakt.md) | Teamregler |
| [Sprintdokumentation](docs/sprintar/) | Planning, standup, review, retro |
| [Individuella reflektioner](docs/reflektioner/) | Kursreflektioner |

**Senast uppdaterad:** 2026-11-25 (receptflöde implementerat på feature-branch; sprint 3 pågår).
