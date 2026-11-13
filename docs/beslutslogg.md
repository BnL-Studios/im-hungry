# Beslutslogg

Dokumentation av viktiga produkt- och teknikbeslut för **I'm Hungry!**. Varje beslut beskriver bakgrund, övervägda alternativ, motivering och konsekvenser.

> **Aktuellt (2026-11-13, sprint 1):** Vi använder lokal Expo SQLite + Drizzle ORM för inventariet och en planerad Supabase Edge Function för AI. Spring Boot/PostgreSQL är ersatta teknikval. Matförrådets lista och formulär för att lägga till en råvara är implementerade på branchen `add-ingredient`; receptflödet är inte byggt. Historiska beslut finns kvar nedan.

## Översikt

| Nr | Beslut | Datum | Status |
|:--:|---|---|---|
| **01** | [App-idé och MVP](#beslut-01) | 2026-10-27 | **Gäller** |
| **02** | [Tidigare teknikstack](#beslut-02) | 2026-10-27 | **Ersatt av 06** |
| **03** | [AI-leverantör: Gemini Flash](#beslut-03) | 2026-10-27 | **Gäller (AI-val); integration ej byggd** |
| **04** | [Databasleverantör: Supabase](#beslut-04) | 2026-10-27 | **Ersatt av 06** (Edge Function enligt 07) |
| **05** | [Utvecklingsflöde: Trunk-Based Development](#beslut-05) | 2026-10-27 | **Gäller** |
| **06** | [Lokal mobilarkitektur: Expo, SQLite och Drizzle](#beslut-06) | 2026-11-02 | **Gäller** |
| **07** | [AI-gateway: Supabase Edge Function](#beslut-07) | 2026-11-02 | **Gäller som målarkitektur; ej implementerat** |

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
- Ett litet urval mat-humör, t.ex. *Comfort food*, *Quick & easy* och *Surprise me*.
- Ett AI-genererat receptförslag utifrån det som finns hemma, med begripliga fel- och tomma lägen.

**Utanför MVP:n:** inloggning/konton, delning i hushåll, molnsynk, inköpslista, näringsberäkning, streckkodsskanning, favoriter, recepthistorik och automatiska avdrag. Dessa ligger i backloggen.

**Status i sprint 1:** Visa och lägga till är implementerat; ändra/ta bort, mat-humör och recept återstår.

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

**Datum:** 2026-10-27 · **Status:** Gäller för AI-valet; integrationen är inte byggd · **Ersätter:** tidigare DeepSeek-idé

> **Beslut**
> Vi använder **Google Gemini Flash** för receptgenereringen. Exakt modellversion väljs när integrationen byggs, så att vi kan använda en aktuell Flash-modell.

### Bakgrund

Appens kärnfunktion är att generera receptförslag utifrån livsmedlen i hemmet. Vi behövde välja AI-leverantör och modell innan vi bygger integrationen i backend. Efter att först ha tittat på DeepSeek landade vi i Gemini.

### Övervägda alternativ

- DeepSeek (open source, men API debiteras per token).
- OpenAI (GPT).
- Anthropic (Claude).
- Google Gemini Flash (valt).
- Egen lokal modell via t.ex. Ollama.

### Motivering

Gemini Flash-modellerna ingår i Geminis kostnadsfria API-nivå (Free Tier), så vi kan bygga och testa AI-flödet utan att sätta upp fakturering. Flash-modellerna är snabba och tillräckligt kapabla för att generera recept på svenska utifrån en lista råvaror. DeepSeek föll på att API-anropen debiteras per token. Vi valde bort de andra leverantörerna för att de antingen kostar pengar från första token eller låser oss hårdare vid en leverantör.

### Konsekvenser

- **API-nyckel:** API-nyckeln ska ligga i Supabase Edge Functionens hemlighetshantering, aldrig i React Native-appen, Git eller `EXPO_PUBLIC_*`.
- **Begränsningar på gratisnivån:** Gratisnivån är hastighetsbegränsad. Exakta RPM/RPD-siffror syns per projekt i Google AI Studios rate-limit-konsol. Vi behöver hantera 429-svar (t.ex. kö eller backoff) och räkna med att gratisnivån kan ta slut vid mycket användning.
- **Dataanvändning:** På gratisnivån får Google använda prompts och svar för att förbättra sina produkter. Vi skickar därför **inte** känsliga personuppgifter – bara livsmedelslistor. Vid behov av mer kapacitet eller dataskydd flyttar vi projektet till betald nivå.
- **Utbytbar AI-tjänst:** AI-anropet läggs bakom Edge Functionen så att vi kan byta modell eller leverantör utan att röra mobilappen.
- **Status:** AI-anropet är inte implementerat i sprint 1. Läs mer om [Geminis rate limits](https://ai.google.dev/gemini-api/docs/rate-limits), [priser](https://ai.google.dev/gemini-api/docs/pricing) och [villkor](https://ai.google.dev/gemini-api/terms).

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
- **Sprint 1 (2026-11-13):** Listan läser från SQLite och formuläret för att lägga till en råvara är implementerat på branchen `add-ingredient`. Ändra/ta bort återstår.

---

<a id="beslut-07"></a>
## 07 — Receptgenerering via Supabase Edge Function

**Datum:** 2026-11-02 · **Status:** Gäller som målarkitektur; ej implementerat

> **Beslut**
> Vid receptbegäran skickar Expo-appen **endast inventariet och valt mat-humör** till en **Supabase Edge Function (Deno/TypeScript)**. Funktionen validerar indata, anropar Gemini med en **serverlagrad privat API-nyckel** och returnerar ett validerat strukturerat recept. Matförrådet lagras fortfarande bara lokalt i SQLite.

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

- **Dataflöde:** SQLite → appens begäran (råvaror, mängder, enheter, mat-humör) → Edge Function → AI → funktion → app. Begäran görs bara när användaren vill ha recept.
- **Onlinekrav:** Receptgenerering kräver uppkoppling. Matförrådet fungerar offline.
- **Säkerhet:** Lägg AI-nyckeln i Supabase-funktionens hemlighetshantering. Validera förfrågningsstorlek, tillåtna värden och AI-svarets format; hantera fel och kvotgränser.
- **Skydd mot missbruk:** MVP:n saknar användarkonton. En publik Edge Function kan missbrukas; säkra rate limiting, kvoter, övervakning och en rimlig anropskontroll **innan publik lansering**. En publik Supabase-nyckel är inte hemlig.
- **Korrekthet:** Funktionen kan kontrollera AI:s recept mot de **inskickade** ingredienserna men känner inte den lokala databasens faktiska saldo. Mobilappen måste kontrollera receptet mot sitt lokala inventarie innan det visas som genomförbart.
- **Dataminimering:** Skicka inte användarkonto eller andra personuppgifter i onödan.
- **Framtid:** AI-leverantören kan bytas bakom funktionen utan att mobilappens lokala datalager ändras.
- **Status i sprint 1:** Ingen `supabase/`-kod, ingen anropsklient och ingen receptvy finns ännu. Flödet byggs efter att inventariets CRUD är klart.

Detaljer finns i [arkitekturdokumentet](arkitektur.md).

---

## Uppdateringar

| Datum | Ändring | Varför |
|---|---|---|
| 2026-10-27 | Beslut 01–05 skapade. | Första teknik- och produktvalen. |
| 2026-11-02 | Beslut 06–07 ersatte Spring Boot/PostgreSQL med lokal SQLite och Edge Function. | Enklare MVP med lokal data och säker AI-gateway. |
| 2026-11-13 | Status och konsekvenser uppdaterade; platshållare borttagna. | Dokumentationen ska spegla sprint 1. Inga nya arkitekturbeslut togs. |
