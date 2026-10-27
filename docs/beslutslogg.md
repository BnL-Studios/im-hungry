# Beslutslogg

Dokumentation av viktiga produkt- och teknikbeslut för **I'm Hungry!**. Varje beslut beskriver bakgrund, övervägda alternativ, motivering och konsekvenser.

> **Att komplettera:** Text inom hakparenteser (`[...]`) är ännu inte färdigställd. Datum och källhänvisningar behöver också ses över där de är ofullständiga.

## Översikt

| Nr | Beslut | Datum | Status |
|:--:|---|---|---|
| **01** | [App-idé och MVP](#beslut-01) | [2026-10-27] | **Gäller** |
| **02** | [Teknikstack](#beslut-02) | [2026-10-27] | **Gäller** |
| **03** | [AI-leverantör: Gemini Flash](#beslut-03) | [ÅÅÅÅ-MM-DD] | **Gäller** |
| **04** | [Databasleverantör: Supabase](#beslut-04) | 2026-10-27 | **Gäller** |
| **05** | [Utvecklingsflöde: Trunk-Based Development](#beslut-05) | 2026-10-27 | **Gäller** |

---

<a id="beslut-01"></a>
## 01 — App-idé och MVP

**Datum:** [2026-10-27] · **Status:** Gäller

> **Beslut**  
> Vi bygger en vardagsapp där användaren håller koll på sina livsmedel och råvaror i hemmet. Utifrån vad som finns i kylskåpet och skafferiet genererar en integrerad AI receptförslag.

### Bakgrund

Vi behövde enas om vilken typ av app vi bygger och vad som ska ingå i första versionen (MVP), innan vi satte upp projektet och valde teknik.

### Övervägda alternativ

- **Alternativ A:** [t.ex. "Receptapp med sökfunktion och sparade favoriter"]
- **Alternativ B:** [t.ex. "Inköpslisteapp med delning i hushållet"]
- **Alternativ C:** ["Vardagsapp för att hålla koll på livsmedel och råvaror i hemmet, som med AI föreslår recept utifrån vad som finns i kyl och skafferi"]

### Motivering

Vi valde det här för att [främsta anledningen – t.ex. "det löser ett verkligt problem: man vet inte vad man ska laga och slänger mat i onödan"]. AI-delen är det som gör appen unik jämfört med en vanlig receptapp, och den knyter ihop lagerhållningen med ett konkret värde för användaren. Vi valde bort [övriga alternativ] för att [anledning – t.ex. "de finns redan som färdiga appar"].

### Konsekvenser

**MVP:n innehåller:**

- Registrera, ändra och ta bort livsmedel/råvaror
- Sortera dem på plats (kylskåp / skafferi) och [t.ex. kategori eller utgångsdatum]
- Generera receptförslag med AI utifrån det som finns hemma

**Utanför MVP:n:** [t.ex. inloggning, delning i hushåll, inköpslista, näringsberäkning, streckkodsscanning] – dessa läggs i backloggen.

AI-integrationen blir en egen post i loggen när vi valt leverantör/API.

---

<a id="beslut-02"></a>
## 02 — Teknikstack: React Native, Spring Boot och PostgreSQL

**Datum:** [2026-10-27] · **Status:** Gäller

> **Beslut**  
> React Native i frontend, Spring Boot i backend och PostgreSQL som databas. PostgreSQL driftas via **Supabase** enligt [beslut 04](#beslut-04).

### Bakgrund

Vi behövde välja teknik innan vi satte upp projektet. Appen ska fungera som en mobil vardagsapp och ha både lagring av livsmedel och AI-genererade recept.

### Övervägda alternativ

- **Alternativ A:** [t.ex. React + Node/Express + PostgreSQL (webb först)]
- **Alternativ B:** [t.ex. Flutter + Firebase]
- **Alternativ C:** ["React Native, Spring Boot och PostgreSQL"]

### Motivering

React Native ger en native mobilapp för både iOS och Android med samma kodbas, vilket passar en app man använder i köket och i butiken. Spring Boot ger en stabil backend med bra stöd för REST-API och integration mot AI-tjänsten. PostgreSQL passar vår datamodell med livsmedel, platser och recept och har bra stöd i Spring Boot via JPA. Vi valde bort [övriga alternativ] för att [anledning – t.ex. "Firebase låser oss till en leverantör"].

### Konsekvenser

- Frontend (JavaScript/TypeScript) och backend (Java) är olika språk, så vi behöver hålla API-kontraktet tydligt mellan dem [byt ut om någon i gruppen redan kan Java/Spring].
- [Om relevant: "X behöver lära sig Spring Boot – vi parprogrammerar första sprinten."]
- Vi behöver tidigt ordna en fungerande PostgreSQL-miljö för teamet. Den gemensamma databasen driftas via Supabase enligt [beslut 04](#beslut-04); en lokal PostgreSQL-instans kan användas vid behov för utveckling och test.

---

<a id="beslut-03"></a>
## 03 — AI-leverantör: Gemini Flash

**Datum:** [ÅÅÅÅ-MM-DD] · **Status:** Gäller · **Ersätter:** #3 DeepSeek

> **Beslut**  
> Vi använder **Google Gemini Flash** (t.ex. `gemini-3.8-flash` eller `gemini-3.6-flash`) för receptgenereringen.

### Bakgrund

Appens kärnfunktion är att generera receptförslag utifrån livsmedlen i hemmet. Vi behövde välja AI-leverantör och modell innan vi byggde integrationen i backend. Efter att först ha tittat på DeepSeek har vi landat i Gemini.

### Övervägda alternativ

- DeepSeek (open source, men API debiteras per token)
- OpenAI (GPT)
- Anthropic (Claude)
- Google Gemini Flash
- [Egen lokal modell via t.ex. Ollama]

### Motivering

Gemini Flash-modellerna ingår i Geminis **kostnadsfria API-nivå** (”Free Tier”) – man kan anropa dem utan betalkort och utan att sätta upp fakturering[reference:2][reference:3]. Det passar vår MVP: vi kan bygga och testa AI-flödet utan att lägga pengar på tokens, och Flash-modellerna är snabba och tillräckligt kapabla för att generera recept på svenska utifrån en lista råvaror. DeepSeek föll på att API-anropen debiteras per token, medan Gemini ger oss en gratis väg in. Vi valde bort de andra leverantörerna för att [anledning – t.ex. ”de kostar pengar från första token” / ”vi vill inte låsa oss till en leverantör”].

### Konsekvenser

- **API-nyckel:** **API-nyckeln hamnar i Spring Boot-backend**, aldrig i React Native-appen. AI-anropet går via backend.
- **Begränsningar på gratisnivån:** **Gratisnivån är hastighetsbegränsad.** Exakta RPM/RPD-siffror publiceras inte längre öppet, utan syns per projekt i Google AI Studios rate-limit-konsol[reference:4]. Vi behöver hantera 429-svar (t.ex. köa eller backoff) och får räkna med att gratisnivån kan ta slut vid mycket användning.
- **Dataanvändning:** På gratisnivån får Google använda prompts och svar för att förbättra sina produkter[reference:5][reference:6]. Vi skickar därför **inte** känsliga personuppgifter – bara livsmedelslistor. Skulle vi senare behöva mer kapacitet eller dataskydd flyttar vi projektet till betald nivå (genom att koppla fakturering).
- **Utbytbar AI-tjänst:** AI-anropet läggs bakom ett eget tjänstelager i backend så att vi kan byta modell eller leverantör utan att röra frontend.


---

<a id="beslut-04"></a>
## 04 — Databasleverantör: Supabase

**Datum:** 2026-10-27 · **Status:** Gäller · **Relaterat:** [Beslut 02 – Teknikstack](#beslut-02)

> **Beslut**  
> Vi använder **Supabase som leverantör för vår PostgreSQL-databas**. PostgreSQL är fortfarande databastekniken och Spring Boot är fortsatt appens backend.

### Bakgrund

Vi har valt PostgreSQL i teknikstacken men behöver även bestämma var databasen ska köras och hur teamet ska komma åt en gemensam utvecklingsmiljö.

### Alternativ

- Drifta PostgreSQL själva, lokalt eller på en egen server.
- Använda en annan hanterad PostgreSQL-tjänst.
- **Använda Supabase som hanterad PostgreSQL-leverantör (valt).**

### Motivering

Supabase ger oss en hanterad PostgreSQL-miljö och minskar behovet av att själva sätta upp och underhålla databasservern. Det gör det enklare för ett team på två personer att fokusera på applikationens funktioner och arbeta mot en gemensam databas under kursen.

### Konsekvenser

- **Arkitektur:** React Native kommunicerar med Spring Boot-backendens API. Backend ansvarar för att läsa och ändra data i PostgreSQL via Supabase. Mobilappen ska inte innehålla databasens anslutningsuppgifter.
- **Konfiguration och säkerhet:** Databasens autentiseringsuppgifter och anslutningsinformation hålls utanför versionshanteringen och konfigureras som hemligheter eller miljövariabler.
- **Databasschema:** Vi dokumenterar tabeller och relationer i `docs/databasschema.md` och behåller DBML-källan. När vi börjar implementera databasen använder vi versionshanterade migrationer för schemaändringar.
- **Miljöer:** Teamet behöver komma överens om hur utvecklings- och testdata hanteras. En separat testmiljö eller lokal PostgreSQL kan användas för att undvika att testkörningar förstör delad data.
- **Avgränsning:** Valet av Supabase som databasleverantör innebär **inte** att vi automatiskt väljer Supabase Auth, Storage eller direkt åtkomst från mobilappen. Sådana tjänster kräver egna beslut om vi senare behöver dem.

---

<a id="beslut-05"></a>
## 05 — Utvecklingsflöde: Trunk-Based Development

**Datum:** 2026-10-27 · **Status:** Gäller

> **Beslut**  
> Vi följer **Trunk-Based Development (TBD)** med `main` som gemensam huvudgren. Vi arbetar i små, kortlivade branches och integrerar ändringar regelbundet via pull requests.

### Bakgrund

Vi är två utvecklare som bygger samma applikation under en Scrum-kurs. Vi behöver ett enkelt Git-arbetsflöde som underlättar samarbete, kodgranskning och kontinuerlig integrering utan att ändringar samlas i långlivade grenar.

### Alternativ

- GitFlow med separata, mer långlivade `develop`- och release-grenar.
- Arbete direkt på `main` utan pull-request-granskning.
- **Trunk-Based Development med små, kortlivade branches och pull requests (valt).**

### Motivering

Täta integrationer och mindre ändringar minskar risken för stora merge-konflikter och gör det enklare för oss att granska varandras kod. Det passar ett litet team som behöver kunna visa fungerande resultat under varje sprint.

### Konsekvenser

- **Huvudgren:** `main` är vår trunk och ska hållas i fungerande skick. Vi använder ingen långlivad `develop`-gren.
- **Branches:** Varje avgränsad ändring görs på en kortlivad branch som utgår från aktuell `main`. Vi hämtar ändringar från `main` regelbundet så att våra branches inte glider isär.
- **Pull requests:** Vi öppnar små pull requests och låter den andra teammedlemmen granska innan merge, i enlighet med gruppens överenskomna kodgranskningsregler och eventuellt branchskydd.
- **Integrering:** Färdiga, granskade ändringar mergas tillbaka till `main` så snart som möjligt, i stället för att hållas till slutet av en sprint.
- **Ofärdigt arbete:** Större funktioner delas upp i mindre, säkra leveranser. Funktioner som ännu inte är redo att exponeras hålls avstängda eller isolerade så att `main` fortsätter fungera.
- **Kvalitet:** Varje merge ska uppfylla teamets Definition of Done och relevanta kontroller. Arbetsflödet följs upp vid sprint-retrospektiv och justeras vid behov.
