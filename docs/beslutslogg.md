# Beslutslogg

Dokumentation av viktiga produkt- och teknikbeslut för **I'm Hungry!**. Varje beslut beskriver bakgrund, övervägda alternativ, motivering och konsekvenser.

> **Aktuellt (2026-11-25, sprint 3):** Vi använder lokal Expo SQLite + Drizzle ORM för inventariet och en implementerad Supabase Edge Function för AI i `supabase/functions/generate-recipe/`. Spring Boot/PostgreSQL är ersatta teknikval. Första inventarieflödet är mergat via PR #122; ändra mängd, ta bort med bekräftelse och skalor är implementerade. Receptflödet är implementerat på branchen `screen-and-page-for-generate-recipe` (implementerat på branch, issue/PR-status separat); #143 och #129 är öppna på GitHub och #135 är inte implementerat. Sex testfiler / 34 tester finns i `mobile/` och CI har även ett edge-jobb med `deno test`. Historiska beslut finns kvar nedan.

## Översikt

| Nr | Beslut | Datum | Status |
|:--:|---|---|---|
| **01** | [App-idé och MVP](#beslut-01) | 2026-10-27 | **Gäller** |
| **02** | [Tidigare teknikstack](#beslut-02) | 2026-10-27 | **Ersatt av 06** |
| **03** | [AI-leverantör: Gemini Flash](#beslut-03) | 2026-10-27 | **Gäller; default `gemini-3.5-flash-lite`, integration implementerad på branch, issue/PR-status separat** |
| **04** | [Databasleverantör: Supabase](#beslut-04) | 2026-10-27 | **Ersatt av 06** (Edge Function enligt 07) |
| **05** | [Utvecklingsflöde: Trunk-Based Development](#beslut-05) | 2026-10-27 | **Gäller** |
| **06** | [Lokal mobilarkitektur: Expo, SQLite och Drizzle](#beslut-06) | 2026-11-02 | **Gäller** |
| **07** | [AI-gateway: Supabase Edge Function](#beslut-07) | 2026-11-02 | **Gäller; Edge Function implementerad i `supabase/functions/generate-recipe/`** |

---

<a id="beslut-01"></a>
## 01 — App-idé och MVP

**Datum:** 2026-10-27 · **Status:** Gäller

> **Beslut**
> Vi bygger en vardagsapp där användaren håller koll på sina livsmedel och råvaror i hemmet. Utifrån vad som finns i kylskåp och skafferi genererar en AI ett receptförslag.

### Bakgrund

Vi behövde enas om vilken typ av app vi bygger och vad som ska ingå i första versionen (MVP), innan vi satte upp projektet och valde teknik.

### Övervägda alternativ

- **Alternativ A:** Receptapp med sökfunktion och sparade favoriter.
- **Alternativ B:** Inköpslisteapp med delning i hushållet.
- **Alternativ C (valt):** Vardagsapp för att hålla koll på livsmedel och råvaror i hemmet, som med AI föreslår recept utifrån vad som finns i kyl och skafferi.

### Motivering

Vi valde alternativ C för att det löser ett verkligt problem: man vet inte vad man ska laga och slänger mat i onödan. AI-delen är det som gör appen unik jämfört med en vanlig receptapp, och den knyter ihop lagerhållningen med ett konkret värde för användaren. A och B valdes bort eftersom de redan finns som färdiga appar och inte ger samma koppling mellan det man har hemma och ett konkret recept.

### Konsekvenser

**MVP:n innehåller:**

- Registrera, visa, ändra och ta bort råvaror med mängd och enhet.
- Ett AI-receptförslag som tar **enbart ingredienslistan** som indata och returnerar recepttitel, använda ingredienser, tillagningssteg och uppskattad tid i minuter.
- Begripliga fel- och tomma lägen när ett giltigt recept inte går att få.

**Utanför MVP:n:** mat-humör (US-06; tidigare planerat för MVP), inloggning/konton, delning i hushåll, molnsynk, inköpslista, näringsberäkning, streckkodsskanning, favoriter, recepthistorik och automatiska avdrag. Dessa ligger i backloggen.

**Status 2026-11-25:** Visa/lägga till är mergat via PR #122; ändra/ta bort är implementerade. Receptflödet är implementerat på branch — implementerat på branch, issue/PR-status separat (#143 och #129 är öppna på GitHub). #135 (mängder i tillagningsstegen) är inte implementerat; mat-humör flyttat till efter MVP enligt förenkling 2026-11-19.

---

<a id="beslut-02"></a>
## 02 — Tidigare teknikstack: React Native, Spring Boot och PostgreSQL

**Datum:** 2026-10-27 · **Status:** Ersatt av [beslut 06](#beslut-06)

> **Historisk beskrivning:** Avsnittet nedan visar tidigare val; se beslut 06 för aktuellt teknikval.

> **Beslut**
> React Native i frontend, Spring Boot i backend och PostgreSQL som databas. PostgreSQL driftas via **Supabase** enligt [beslut 04](#beslut-04).

### Bakgrund

Vi behövde välja teknik innan vi satte upp projektet. Appen ska fungera som en mobil vardagsapp och ha både lagring av livsmedel och AI-genererade recept.

### Övervägda alternativ

- **Alternativ A:** React + Node/Express + PostgreSQL (webb först).
- **Alternativ B:** Flutter + Firebase.
- **Alternativ C (valt då):** React Native, Spring Boot och PostgreSQL.

### Motivering

React Native ger en native mobilapp för både iOS och Android med samma kodbas, vilket passar en app man använder i köket och i butiken. Spring Boot ger en stabil backend med bra stöd för REST-API och integration mot AI-tjänsten. PostgreSQL passar datamodellen med livsmedel, platser och recept och har bra stöd i Spring Boot via JPA. Firebase valdes bort för att vi inte ville låsa oss vid en leverantör.

### Konsekvenser

- Frontend (TypeScript) och backend (Java) är olika språk, så API-kontraktet behöver hållas tydligt.
- Teamet behövde lära sig Spring Boot och PostgreSQL.
- En gemensam PostgreSQL-miljö behövde sättas upp.

**Varför beslutet ersattes:** För MVP:ns lilla lokala matförråd gav den extra backend- och databasserveringen inte proportionell nytta. Spring Boot-koden togs bort i PR #104.

---

<a id="beslut-03"></a>
## 03 — AI-leverantör: Gemini Flash

**Datum:** 2026-10-27 · **Uppdaterat:** 2026-11-25 · **Status:** Gäller; integrationen är implementerad på branch, issue/PR-status separat · **Ersätter:** tidigare DeepSeek-idé

> **Beslut**
> Vi använder Gemini Flash för receptgenereringen. Koden defaultar till **Gemini 3.5 Flash-Lite** (`gemini-3.5-flash-lite`); modellen kan sättas via `GEMINI_MODEL` och reserven via `GEMINI_BACKUP_MODEL`. Integrationen är implementerad på branch (issue/PR-status separat).

### Bakgrund

Appens kärnfunktion är att generera receptförslag utifrån livsmedlen i hemmet. Vi behövde välja AI-leverantör och modell innan vi bygger integrationen i backend. Efter att först ha tittat på DeepSeek landade vi i Gemini.

### Övervägda alternativ

- DeepSeek (open source, men API debiteras per token).
- OpenAI (GPT).
- Anthropic (Claude).
- Google Gemini Flash (**valt**; koden defaultar till `gemini-3.5-flash-lite`, överridas av `GEMINI_MODEL`/`GEMINI_BACKUP_MODEL`).
- Egen lokal modell via t.ex. Ollama.

### Motivering

Gemini Flash har strukturerade JSON-svar och text-in/utdata som listas som kostnadsfria på Gemini API:s Free Tier (kontrollerat 2026-11-19). Vi prioriterar en stabil Flash-modell med tillräcklig förmåga att följa inventarie- och mängdkrav framför en tyngre betald modell. Gemini 3.5 Flash-Lite används som default och kan bytas med samma kontrakt vid kvot- eller kapacitetsproblem. **Detta är en leverantörs- och modellrekommendation baserad på officiella villkor, inte en verifierad API-prenumeration eller garanterad tillgång i vårt projekt.** Exakta rate limits och åtkomst måste kontrolleras med teamets egen API-nyckel. Se [AI-integrationsdesignen](ai-integration.md).

### Konsekvenser

- **API-nyckel:** Hemligheten i Edge Functionen heter `GEMINI_API` (inte `GEMINI_API_KEY`) och ligger i Supabase-funktionens hemlighetshantering, aldrig i React Native-appen, Git eller `EXPO_PUBLIC_*`. Mobilen läser `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` och valfritt `EXPO_PUBLIC_GENERATE_RECIPE_URL`. Användaren har manuellt testat end-to-end mot riktig Gemini och fått recept.
- **Begränsningar på gratisnivån:** Gratisnivån är hastighetsbegränsad och kontoberoende. Exakta RPM/TPM/RPD-siffror syns per projekt i Google AI Studios rate-limit-konsol. Hantera 429-svar, återförsök med gräns och slut på kvot; ingen fakturering aktiveras utan nytt beslut.
- **Dataanvändning:** På gratisnivån får Google använda prompts och svar för att förbättra sina produkter. Vi skickar därför **inte** känsliga personuppgifter – bara livsmedelslistor. Vid behov av mer kapacitet eller dataskydd flyttar vi projektet till betald nivå.
- **Utbytbar AI-tjänst:** AI-anropet läggs bakom Edge Functionen så att vi kan byta modell eller leverantör utan att röra mobilappen.
- **Kontrakt:** Begäran och svar är specificerade i [AI-integrationsdesignen](ai-integration.md) (#125), inklusive inventarie-ID, mängdkontroll och fel.
- **Status 2026-11-25:** Edge Function och verkligt anrop är implementerade på branch; manuell E2E mot riktig Gemini är testad av användaren. Issue/PR-status separat (#143/#129 öppna). Källor: [modellkort](https://aistudio.google.com/docs/models/gemini-3.8-flash), [rate limits](https://aistudio.google.com/docs/rate-limits), [priser](https://aistudio.google.com/docs/pricing) och [villkor](https://ai.google.dev/gemini-api/terms).

---

<a id="beslut-04"></a>
## 04 — Databasleverantör: Supabase

**Datum:** 2026-10-27 · **Status:** Ersatt av [beslut 06](#beslut-06)

> **Historisk beskrivning:** Supabase används inte längre som inventariedatabas. Supabase Edge Function används däremot enligt beslut 07. · **Relaterat:** [Beslut 02 – Teknikstack](#beslut-02)

> **Beslut**
> Vi använder **Supabase som leverantör för vår PostgreSQL-databas**. PostgreSQL är fortfarande databastekniken och Spring Boot är fortsatt appens backend.

### Bakgrund

Vi hade valt PostgreSQL i teknikstacken men behövde även bestämma var databasen ska köras och hur teamet kommer åt en gemensam utvecklingsmiljö.

### Alternativ

- Drifta PostgreSQL själva, lokalt eller på en egen server.
- Använda en annan hanterad PostgreSQL-tjänst.
- **Använda Supabase som hanterad PostgreSQL-leverantör (valt).**

### Motivering

Supabase ger en hanterad PostgreSQL-miljö och minskar behovet av att sätta upp och underhålla databasservern. Det gör det enklare för ett team på två personer att fokusera på applikationens funktioner.

### Konsekvenser

- **Arkitektur:** React Native skulle kommunicera med Spring Boot-backendens API, som läser och ändrar data i PostgreSQL via Supabase.
- **Konfiguration och säkerhet:** Databasens autentiseringsuppgifter och anslutningsinformation hålls utanför versionshanteringen.
- **Databasschema:** Vi dokumenterar tabeller och relationer i `docs/databasschema.md` och behåller DBML-källan.
- **Avgränsning:** Supabase Auth, Storage och direkt åtkomst från mobilappen kräver egna beslut.

**Varför beslutet ersattes:** Inventariet behöver ingen molndatabas i MVP:n; det lagras lokalt i SQLite enligt beslut 06. Supabase behålls bara som värd för Edge Function enligt beslut 07.

---

<a id="beslut-05"></a>
## 05 — Utvecklingsflöde: Trunk-Based Development

**Datum:** 2026-10-27 · **Status:** Gäller

> **Beslut**
> Vi följer **Trunk-Based Development (TBD)** med `main` som gemensam huvudgren. Vi arbetar i små, kortlivade branches och integrerar ändringar regelbundet via pull requests. **Squash and merge är standard.**

### Bakgrund

Vi är två utvecklare som bygger samma applikation under en Scrum-kurs. Vi behöver ett enkelt Git-arbetsflöde som underlättar kodgranskning och kontinuerlig integrering utan att ändringar samlas i långlivade grenar.

### Alternativ

- GitFlow med separata, mer långlivade `develop`- och release-grenar.
- Arbete direkt på `main` utan pull-request-granskning.
- **Trunk-Based Development med små, kortlivade branches och pull requests (valt).**

### Motivering

Täta integrationer och mindre ändringar minskar risken för stora merge-konflikter och gör det enklare att granska varandras kod. Det passar ett litet team som behöver visa fungerande resultat under varje sprint.

### Konsekvenser

- **Huvudgren:** `main` är vår trunk och ska hållas i fungerande skick. Vi använder ingen långlivad `develop`-gren.
- **Branches:** Varje avgränsad ändring görs på en kortlivad branch som utgår från aktuell `main`. Vi hämtar ändringar från `main` regelbundet.
- **Pull requests:** Vi öppnar små pull requests och låter den andra teammedlemmen granska innan merge. Enligt gruppkontraktet granskar vi inom 24 timmar och mergar inte vår egen PR. Branchskyddet på `main` ska kräva minst ett godkännande.
- **Merge-strategi:** **Squash and merge** är standard så att en PR blir en sammanhållen commit på `main`.
- **Integrering:** Färdiga, granskade ändringar mergas tillbaka till `main` så snart som möjligt.
- **Ofärdigt arbete:** Större funktioner delas upp i mindre, säkra leveranser. Funktioner som ännu inte är redo att exponeras hålls avstängda eller isolerade.
- **Kvalitet:** Varje merge ska uppfylla teamets Definition of Done och relevanta CI-kontroller.

---

<a id="beslut-06"></a>
## 06 — Lokal mobilarkitektur: Expo, SQLite och Drizzle ORM

**Datum:** 2026-11-02 · **Status:** Gäller · **Ersätter:** [02](#beslut-02) och [04](#beslut-04)

> **Beslut**
> React Native + Expo + TypeScript används för mobilappen. Matförrådet sparas **lokalt i Expo SQLite** och databasåtkomsten hanteras med **Drizzle ORM**. Drizzle Kit genererar migrationsfiler som versionshanteras och tillämpas i appen.

### Bakgrund

Den tidigare Spring Boot-/PostgreSQL-stackens extra drift och API-lager ger inte proportionell nytta för MVP:ns lilla lokala matförråd.

### Övervägda alternativ

- Behålla Spring Boot och Supabase PostgreSQL.
- Expo SQLite med handskriven SQL och egen migrationshantering.
- **Expo SQLite med Drizzle ORM och Drizzle Kit (valt).**

### Motivering

Lokala inventarieoperationer ska fungera utan internet. Drizzle ger ett enhetligt TypeScript-schema, typade frågor och en tydlig migrationsprocess, samtidigt som SQLite ansvarar för faktisk lagring och transaktioner.

### Konsekvenser

- UI-anrop går via verksamhetsoperationer till repositories/Drizzle, inte direkt via SQL i komponenter. Det är implementerat i `features/inventory/`.
- En SQLite-databas finns per appinstallation; ingen kontosynk eller automatisk återställning i MVP:n.
- Schema och migrationer är teknisk sanningskälla. [Databasschemat](databasschema.md) är implementerat, inte ett utkast.
- Validera mängd och enhet både i kod och med SQLite-begränsningar. Testa migrering från befintlig databas utan dataförlust.
- De gamla backendfilerna togs bort i PR #104 tillsammans med flytten till `mobile/`. CI använder `Mobile (Node 22)`; branch protection kan behöva uppdateras manuellt.
- **Sprint 1–3 (uppdaterat 2026-11-25):** Listan läser från SQLite (PR #122). Lägga till, ändra mängd och ta bort med bekräftelse är implementerade; skalor sparas som basenheter. Sex testfiler / 34 tester i `mobile/` täcker validering, skalor, enheter och migrationer; CI har även ett edge-jobb med `deno test`.

---

<a id="beslut-07"></a>
## 07 — Receptgenerering via Supabase Edge Function

**Datum:** 2026-11-02 · **Uppdaterat:** 2026-11-25 · **Status:** Gäller; Edge Function implementerad i `supabase/functions/generate-recipe/` (issue/PR-status separat)

> **Beslut**
> Vid receptbegäran skickar Expo-appen **endast ingredienslistan** till en **Supabase Edge Function (Deno/TypeScript)**. Funktionen validerar indata, anropar Gemini med en **serverlagrad privat API-nyckel** och returnerar på framgång exakt fyra fält: `title`, `ingredients`, `steps`, `estimatedCookingTime`. Matförrådet lagras fortfarande bara lokalt i SQLite.

### Bakgrund

AI-recept kräver en säker anropsväg. En privat AI-nyckel som byggs in i en distribuerad mobilapp kan extraheras. Samtidigt vill teamet inte drifta en egen långlivad applikationsserver.

### Övervägda alternativ

- Anropa Gemini direkt från mobilen med privat nyckel (**bortvalt av säkerhetsskäl**).
- Egen Spring Boot-/Node-server som AI-gateway.
- On-device AI utan internet (utanför MVP:ns nuvarande omfattning).
- **Supabase Edge Function som serverlös AI-gateway (valt).**

### Motivering

En Edge Function kan förvara AI-nyckeln på serversidan och gör det möjligt att validera och begränsa API-anrop utan att introducera en egen databas eller en omfattande backend.

### Konsekvenser

- **Dataflöde:** SQLite → appens begäran (endast `ingredients` med ID, namn, mängd, enhet) → Edge Function → AI → funktion → app. Lyckat svar innehåller fyra receptfält utan `status`- eller `recipe`-wrapper. Begäran görs bara när användaren vill ha recept. I appen öppnas fliken Generate Recipe som modalen `/generate-recipe`; lyckad generation navigerar till `/recipe` (web-fallback i `(tabs)/generate.tsx`).
- **Onlinekrav:** Receptgenerering kräver uppkoppling. Matförrådet fungerar offline.
- **Säkerhet:** Lägg AI-nyckeln i Supabase-funktionens hemlighetshantering. Validera förfrågningsstorlek, tillåtna värden och AI-svarets format; hantera fel och kvotgränser.
- **Skydd mot missbruk:** MVP:n saknar användarkonton. En publik Edge Function kan missbrukas; säkra rate limiting, kvoter, övervakning och en rimlig anropskontroll **innan publik lansering**. En publik Supabase-nyckel är inte hemlig.
- **Korrekthet:** Kontraktet är exakt `title`, `ingredients`, `steps`, `estimatedCookingTime`. Dubbletter av ingredient-ID avvisas och varje unikt ID:s mängd får inte överstiga lagersaldot; salt/olja/vatten får vara basvaror utan ID och ogiltiga råvaror filtreras bort i receptvyn. Funktionen kan kontrollera AI:s recept mot de **inskickade** ingredienserna men känner inte den lokala databasens faktiska saldo. Mobilappen måste kontrollera receptet mot sitt lokala inventarie innan det visas som genomförbart.
- **Dataminimering:** Skicka inte användarkonto eller andra personuppgifter i onödan.
- **Framtid:** AI-leverantören kan bytas bakom funktionen utan att mobilappens lokala datalager ändras.
- **Status 2026-11-25:** Edge Functionen `generate-recipe` är implementerad i `supabase/functions/generate-recipe/`, tillsammans med anropsklient och receptvy på branch. Tre flikar Hem / Generate Recipe / Råvaror; Generate öppnar modalen `/generate-recipe` och lyckad generation navigerar till `/recipe` (web-fallback i `(tabs)/generate.tsx`). Felkoder inkluderar `NO_RECIPE`, `INVALID_REQUEST`, `INVALID_RECIPE`, `RATE_LIMITED`, `TIMEOUT` och `MODEL_ERROR`. Implementerat på branch, issue/PR-status separat (#143/#129 öppna, #135 ej implementerat).

Detaljer och API-kontrakt finns i [arkitekturdokumentet](arkitektur.md) och [AI-integrationsdesignen](ai-integration.md).

---

## Uppdateringar

| Datum | Ändring | Varför |
|---|---|---|
| 2026-10-27 | Beslut 01–05 skapade. | Första teknik- och produktvalen. |
| 2026-11-02 | Beslut 06–07 ersatte Spring Boot/PostgreSQL med lokal SQLite och Edge Function. | Enklare MVP med lokal data och säker AI-gateway. |
| 2026-11-13 | Status och konsekvenser uppdaterade; platshållare borttagna. | Dokumentationen ska spegla sprint 1. Inga nya arkitekturbeslut togs. |
| 2026-11-17 | Status synkad med koden: PR #122 mergad, US-03/US-04, skalor och 4 testfiler implementerade. CI kör lint. | Dokumentationen ska spegla sprint 2. Inga nya arkitekturbeslut togs. |
| 2026-11-19 | Beslut 03 preciserat till `gemini-3.8-flash` med Flash-Lite som reserv. AI-kontrakt, validering och säkerhetsgräns dokumenterade i `ai-integration.md`. | #125 design klar för review; #127 API-konto/nyckel inte ännu verifierat. |
| 2026-11-19 | Beslut 01/07 och API v1 förenklade: endast ingredienslista in, fyra receptfält ut; US-06 flyttad utanför MVP. | Teamets beslut att minimera första vertikala receptflödet. |
| 2026-11-25 | Receptflödet och Edge Functionen dokumenterade som implementerade på branch; defaultmodell, hemligheten `GEMINI_API`, miljövariabler, kontraktregler och teststatus uppdaterade. | Dokumentationen ska spegla branchen `screen-and-page-for-generate-recipe`; issue/PR-status och #135 är separata. |
