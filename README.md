# I'm Hungry!

**Från råvaror till middag.** I'm Hungry! är en planerad mobilapp som hjälper den som lagar mat hemma att hålla koll på sina råvaror och få AI-genererade recept utifrån **det som faktiskt finns tillgängligt**.

Projektet utvecklas av **BnL Studios** som ett Scrum-projekt inom utbildningen till fullstackutvecklare.

> **Projektstatus – under utveckling.** Repositoriet innehåller just nu ett Spring Boot-grundprojekt, PostgreSQL-/Supabase-konfiguration, ett första databasschema, dokumentation och GitHub Actions-CI. Mobilappen och funktionerna för matförråd och receptgenerering är **ännu inte implementerade**. Funktionerna nedan beskriver målet för MVP:n, inte en färdig produkt.

## Innehåll

- [Idé och målgrupp](#idé-och-målgrupp)
- [MVP – första fungerande versionen](#mvp--första-fungerande-versionen)
- [Teknik och arkitektur](#teknik-och-arkitektur)
- [Kom igång lokalt](#kom-igång-lokalt)
- [Testning och CI](#testning-och-ci)
- [Projektstruktur](#projektstruktur)
- [Arbetssätt och GitHub-board](#arbetssätt-och-github-board)
- [Dokumentation](#dokumentation)
- [Team](#team)

## Idé och målgrupp

Många har redan mat hemma men vet inte vad de kan laga med de ingredienser och mängder som finns. Att leta efter recept manuellt tar tid, och förslagen kräver ofta råvaror som saknas.

**I'm Hungry!** ska göra vägen från råvaror till en möjlig måltid kortare:

1. Registrera vilka råvaror som finns hemma och hur mycket som finns av varje.
2. Välj ett enkelt mat-humör.
3. Få ett receptförslag anpassat till det sparade matförrådet.
4. Läs ingrediensmängder och steg direkt i appen.

**Primär målgrupp:** studenter och unga vuxna som lagar mat hemma. Den första versionen använder en avgränsad demonstrationsprofil, **utan inloggning eller separata användarkonton**.

## MVP – första fungerande versionen

MVP:n är avsiktligt begränsad till en sammanhängande användarresa från **registrerade råvaror** till **ett läsbart recept**.

| Funktion | Förväntat beteende i MVP:n |
|---|---|
| Se matförrådet | Visa sparade råvaror, mängder och enheter samt ett begripligt tomt läge. |
| Lägg till råvara | Ange namn, positiv mängd och enhet (t.ex. g, ml eller st) och spara beständigt via backend. |
| Ändra eller ta bort | Korrigera mängd eller ta bort en råvara; ändringen finns kvar i databasen. |
| Välj mat-humör | Välj exempelvis *Comfort food*, *Quick & easy* eller *Surprise me*. |
| Generera recept | Be AI föreslå **ett** recept med utgångspunkt i tillgängliga råvaror **och mängder**, via backend. |
| Visa resultat och fel | Visa titel, tillagningstid, ingredienser och steg, eller ett begripligt meddelande om inget giltigt recept kan erbjudas. |

**Ingår inte i MVP:n:** konton/inloggning, favoriter och recepthistorik, avancerade filter och matpreferenser, inköpslistor, streckkodsskanning, automatisk avräkning av råvaror efter matlagning eller delning mellan hushåll. Sådant finns i den prioriterade backloggen för senare utveckling.

Se [fullständig MVP-definition](docs/mvp.md), [produktbacklogg med user stories och acceptanskriterier](docs/USER_STORIES.md) samt [GitHub Projects-boarden](https://github.com/orgs/BnL-Studios/projects/1).

## Teknik och arkitektur

| Del | Teknik | Roll/status |
|---|---|---|
| Mobilapp | React Native (JavaScript/TypeScript) | **Vald, ännu inte skapad i repot** |
| Backend | Java 21, Spring Boot 4.1.2, Maven | Grundprojekt med konfiguration och ett första test finns |
| API | REST via Spring Boot | Planerad kommunikation mellan app och backend |
| Databas | PostgreSQL hos Supabase | Vald och konfigurerad som databasleverantör |
| Databasåtkomst | Spring Data JPA / Hibernate | Finns som beroende och konfiguration i backend |
| AI | Google Gemini Flash | Vald leverantör; integrationen är inte byggd ännu |
| CI | GitHub Actions | Bygger och testar backend med en isolerad PostgreSQL-instans |
| Projektstyrning | GitHub Issues och GitHub Projects | Scrum-board, prioritering och spårning av arbete |

**Planerad kommunikationsväg:**

```text
React Native-app (mobil)
        |
        | HTTP / REST
        v
Spring Boot-backend
        |               \
        |                \--> Gemini Flash (receptförslag)
        v
PostgreSQL via Supabase (matförråd)
```

Mobilappen ska **inte** ansluta direkt till databasen eller innehålla AI-/databashemligheter. Backend ansvarar för åtkomst, validering och AI-anrop. Recept skapas vid behov och sparas inte permanent i MVP:n.

Teknikvalen och motiveringarna finns i [beslutsloggen](docs/beslutslogg.md). Databasschemat är fortfarande ett [utkast](docs/databasschema.md), med redigerbar [DBML-källa](docs/databasschema.dbml).

## Kom igång lokalt

Instruktionerna nedan gäller det **backendprojekt som finns idag**. Det finns ännu ingen frontend att installera eller starta. För att starta backend mot teamets Supabase-databas behöver du behörighet och anslutningsuppgifter från teamet.

### Förutsättningar

- **Git** för att klona repot.
- **JDK 21** installerat och tillgängligt i terminalen (`java -version`).
- Nätverksåtkomst till Supabase och **giltiga databasuppgifter** för projektet.
- Du behöver inte installera Maven separat: repot innehåller Maven Wrapper (`mvnw`).

### 1. Klona repot

```bash
git clone https://github.com/BnL-Studios/im-hungry.git
cd im-hungry
```

### 2. Konfigurera databasanslutningen

Kopiera den versionshanterade exempelfilen till en **lokal, ignorerad** konfigurationsfil:

```bash
cp backend/src/main/resources/application-local.properties.example \
   backend/src/main/resources/application-local.properties
```

Öppna `backend/src/main/resources/application-local.properties` och fyll i anslutningen med uppgifter från **Supabase → Project Settings → Database → Connection pooling**:

```properties
# Värdena nedan är exempel/platshållare – använd teamets riktiga uppgifter.
spring.datasource.url=jdbc:postgresql://<pooler-host>:5432/postgres?sslmode=require&currentSchema=imhungry
spring.datasource.username=postgres.<project-ref>
spring.datasource.password=<database-password>
```

- Använd Supabases **session pooler** och dess faktiska värd, port och användarnamn. Använd inte en påhittad anslutningsadress.
- Backend använder PostgreSQL-schemat `imhungry` (inte standardschemat `public`). Schemat måste finnas i databasen innan anslutningen kan användas. Behörig teammedlem kan skapa det med `CREATE SCHEMA IF NOT EXISTS imhungry;` i Supabases SQL-editor.
- Spring Boot använder profilen `local` som standard; `application-local.properties` läses då in och skriver över relevanta värden i `application.properties`.
- **Committa aldrig** din lokala konfiguration, lösenord, `.env`-filer eller API-nycklar. `application-local.properties` omfattas av repots `.gitignore`.

### 3. Starta backend

**macOS / Linux**

```bash
cd backend
./mvnw spring-boot:run
```

**Windows (PowerShell)**

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Spring Boot använder normalt **http://localhost:8080** om ingen annan port har konfigurerats. Backend är ännu ett grundprojekt utan implementerade inventarie- eller receptendpoints, så det finns inte ett färdigt användarflöde att testa efter uppstart.

### Vanliga problem

| Problem | Kontrollera |
|---|---|
| Java-version eller startfel | Kör `java -version` och säkerställ JDK 21. |
| Databasanslutning nekas | Pooler-värd, port, användarnamn, lösenord och nätverksåtkomst. |
| Schema- eller tabellfel | PostgreSQL-schemat `imhungry` måste finnas; inventariefunktionerna och deras persistens är ännu inte implementerade. |
| Saknade lokala inställningar | Kontrollera att filen heter `application-local.properties` och ligger under `src/main/resources/`. |

> **Viktigt för utveckling och test:** Den lokala backendkonfigurationen kan ansluta till teamets **delade** Supabase-databas. Kör inte databastester som kan ändra data mot den miljön. CI använder i stället en separat, tillfällig PostgreSQL-instans.

## Testning och CI

GitHub Actions kör [`.github/workflows/ci.yml`](.github/workflows/ci.yml) automatiskt vid pull requests mot `main` och vid pushar till `main`.

I nuläget använder jobbet **Backend (Java 21)** Maven och PostgreSQL i en isolerad GitHub Actions-miljö. Det behöver inte Supabase- eller Gemini-hemligheter.

Testsviten innehåller för närvarande ett grundläggande Spring Boot-test för att starta applikationskontexten; mer funktionell testtäckning tillkommer när features implementeras.

För lokal körning av `./mvnw verify` behöver testmiljön vara korrekt konfigurerad, med en **separat testdatabas**, så att teamets data inte påverkas.

[Se arbetsflöden och körningar i GitHub Actions](https://github.com/BnL-Studios/im-hungry/actions).

## Projektstruktur

```text
im-hungry/
├── .github/
│   ├── ISSUE_TEMPLATE/             # Mallar för stories och buggar
│   ├── pull_request_template.md    # Checklista för PR och granskning
│   └── workflows/ci.yml            # Java/Maven/PostgreSQL-CI
├── backend/
│   ├── pom.xml                     # Spring Boot, Java 21 och beroenden
│   ├── mvnw / mvnw.cmd             # Maven Wrapper
│   └── src/                        # Källkod, konfiguration och tester
├── docs/
│   ├── USER_STORIES.md             # Prioriterad produktbacklogg
│   ├── mvp.md                      # Scope för första versionen
│   ├── databasschema.md           # Diagram och tabellbeskrivning
│   ├── databasschema.dbml         # Redigerbar databasskiss
│   ├── bilder/                     # Bland annat databasschema.png
│   ├── beslutslogg.md             # Arkitektur- och processbeslut
│   ├── git-workflow.md            # Teamets Git/PR/merge-rutiner
│   ├── gruppkontrakt.md           # Överenskommelser om samarbete
│   ├── definition-of-done.md      # Gemensamma kvalitetskrav
│   ├── sprintar/                  # Sprintmallar och sprintdokumentation
│   └── reflektioner/              # Individuella reflektioner
└── README.md
```

## Arbetssätt och GitHub-board

Vi använder **Scrum** och **trunk-based development**:

- `main` är vår gemensamma, fungerande huvudbranch.
- Vi arbetar i **små, kortlivade branches** som utgår från uppdaterad `main`.
- Ändringar går via **pull requests** med minst **en annan teammedlems godkännande** och gröna CI-kontroller.
- **Squash and merge** är vår normala merge-metod.
- PR:er granskas inom **24 timmar** och **ingen mergar sin egen PR**, enligt gruppkontraktet.
- Koppla gärna PR till dess issue med `Closes #nummer` när arbetet färdigställer ett kort.

**Länkar:** [GitHub Project-board](https://github.com/orgs/BnL-Studios/projects/1) · [Issues](https://github.com/BnL-Studios/im-hungry/issues) · [Pull requests](https://github.com/BnL-Studios/im-hungry/pulls) · [Detaljerad Git-guide](docs/git-workflow.md).

Sprintdokumentationen ligger i [`docs/sprintar/`](docs/sprintar/). Där finns mallar för planning, standup, review och retro.

## Dokumentation

| Dokument | Innehåll |
|---|---|
| [MVP](docs/mvp.md) | Målgrupp, problem, första funktionerna och tydliga avgränsningar |
| [User stories / Product backlog](docs/USER_STORIES.md) | Prioritering (MoSCoW), estimering och acceptanskriterier |
| [Databasschema](docs/databasschema.md) · [DBML](docs/databasschema.dbml) | Diagram, tabeller och redigerbar källkod |
| [Beslutslogg](docs/beslutslogg.md) | Val av teknik, databasleverantör, AI och utvecklingsflöde |
| [Git-arbetsflöde](docs/git-workflow.md) | Stegen från issue och branch till granskad squash-merge |
| [Gruppkontrakt](docs/gruppkontrakt.md) | Tillgänglighet, kommunikation och gemensamma regler |
| [Definition of Done](docs/definition-of-done.md) | Vad en färdig story måste uppfylla |
| [Sprintdokumentation](docs/sprintar/) | Planering, standups, reviews och retrospektiv |
| [Individuella reflektioner](docs/reflektioner/) | Underlag för individuella kursreflektioner |

## Team

| Namn | GitHub |
|---|---|
| Benjamin Simmons | [@SimmoM8](https://github.com/SimmoM8) |
| Leo Spenner | [@spennerr](https://github.com/spennerr) |

**Organisation:** [BnL Studios](https://github.com/BnL-Studios) · **Repository:** [BnL-Studios/im-hungry](https://github.com/BnL-Studios/im-hungry)

---

*Detta är ett utbildningsprojekt under aktiv utveckling. Dokumentationen uppdateras när MVP, databasschema och implementation förändras.*
