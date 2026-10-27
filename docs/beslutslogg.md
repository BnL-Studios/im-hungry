## #1 App-idé och MVP: håll koll på livsmedel och få recept med AI

**Datum:** [2026-10-27]
**Status:** Gäller

**Bakgrund:** Vi behövde enas om vilken typ av app vi bygger och vad som ska ingå i första versionen (MVP), innan vi satte upp projektet och valde teknik.

**Alternativ:**
- [Alternativ A – t.ex. "Receptapp med sökfunktion och sparade favoriter"]
- [Alternativ B – t.ex. "Inköpslisteapp med delning i hushållet"]
- [Alternativ C – "Vardagsapp för att hålla koll på livsmedel och råvaror i hemmet, som med AI föreslår recept utifrån vad som finns i kyl och skafferi"]

**Beslut:** Vi bygger en vardagsapp där användaren håller koll på sina livsmedel och råvaror i hemmet. Utifrån vad som finns i kylskåpet och skafferiet genererar en integrerad AI receptförslag.

**Varför:** Vi valde det här för att [främsta anledningen – t.ex. "det löser ett verkligt problem: man vet inte vad man ska laga och slänger mat i onödan"]. AI-delen är det som gör appen unik jämfört med en vanlig receptapp, och den knyter ihop lagerhållningen med ett konkret värde för användaren. Vi valde bort [övriga alternativ] för att [anledning – t.ex. "de finns redan som färdiga appar"].

**Konsekvenser:** MVP:n innehåller:
- Registrera, ändra och ta bort livsmedel/råvaror
- Sortera dem på plats (kylskåp / skafferi) och [t.ex. kategori eller utgångsdatum]
- Generera receptförslag med AI utifrån det som finns hemma

Utanför MVP:n: [t.ex. inloggning, delning i hushåll, inköpslista, näringsberäkning, streckkodsscanning] – dessa läggs i backloggen. AI-integrationen blir en egen post i loggen när vi valt leverantör/API.

---

## #2 Stack: React Native, Spring Boot och PostgreSQL

**Datum:** [2026-10-27]
**Status:** Gäller

**Bakgrund:** Vi behövde välja teknik innan vi satte upp projektet. Appen ska fungera som en mobil vardagsapp och ha både lagring av livsmedel och AI-genererade recept.

**Alternativ:**
- [Alternativ A – t.ex. React + Node/Express + PostgreSQL (webb först)]
- [Alternativ B – t.ex. Flutter + Firebase]
- [Alternativ C – "React Native, Spring Boot och PostgreSQL"]

**Beslut:** React Native i frontend, Spring Boot i backend och PostgreSQL som databas.

**Varför:** React Native ger en native mobilapp för både iOS och Android med samma kodbas, vilket passar en app man använder i köket och i butiken. Spring Boot ger en stabil backend med bra stöd för REST-API och integration mot AI-tjänsten. PostgreSQL passar vår datamodell med livsmedel, platser och recept och har bra stöd i Spring Boot via JPA. Vi valde bort [övriga alternativ] för att [anledning – t.ex. "Firebase låser oss till en leverantör"].

**Konsekvenser:** Frontend (JavaScript/TypeScript) och backend (Java) är olika språk, så vi behöver hålla API-kontraktet tydligt mellan dem [byt ut om någon i gruppen redan kan Java/Spring]. [Om relevant: "X behöver lära sig Spring Boot – vi parprogrammerar första sprinten."] Vi behöver också sätta upp lokal PostgreSQL tidigt så alla kan köra projektet.
## #3 AI-leverantör: Gemini Flash (ersätter #3 DeepSeek)

**Datum:** [ÅÅÅÅ-MM-DD]
**Status:** Gäller

**Bakgrund:** Appens kärnfunktion är att generera receptförslag utifrån livsmedlen i hemmet. Vi behövde välja AI-leverantör och modell innan vi byggde integrationen i backend. Efter att först ha tittat på DeepSeek har vi landat i Gemini.

**Alternativ:**
- DeepSeek (open source, men API debiteras per token)
- OpenAI (GPT)
- Anthropic (Claude)
- Google Gemini Flash
- [Egen lokal modell via t.ex. Ollama]

**Beslut:** Vi använder **Google Gemini Flash** (t.ex. `gemini-3.8-flash` eller `gemini-3.6-flash`) för receptgenereringen.

**Varför:** Gemini Flash-modellerna ingår i Geminis **kostnadsfria API-nivå** (”Free Tier”) – man kan anropa dem utan betalkort och utan att sätta upp fakturering[reference:2][reference:3]. Det passar vår MVP: vi kan bygga och testa AI-flödet utan att lägga pengar på tokens, och Flash-modellerna är snabba och tillräckligt kapabla för att generera recept på svenska utifrån en lista råvaror. DeepSeek föll på att API-anropen debiteras per token, medan Gemini ger oss en gratis väg in. Vi valde bort de andra leverantörerna för att [anledning – t.ex. ”de kostar pengar från första token” / ”vi vill inte låsa oss till en leverantör”].

**Konsekvenser:**
- **API-nyckeln hamnar i Spring Boot-backend**, aldrig i React Native-appen. AI-anropet går via backend.
- **Gratisnivån är hastighetsbegränsad.** Exakta RPM/RPD-siffror publiceras inte längre öppet, utan syns per projekt i Google AI Studios rate-limit-konsol[reference:4]. Vi behöver hantera 429-svar (t.ex. köa eller backoff) och får räkna med att gratisnivån kan ta slut vid mycket användning.
- **Dataanvändning:** På gratisnivån får Google använda prompts och svar för att förbättra sina produkter[reference:5][reference:6]. Vi skickar därför **inte** känsliga personuppgifter – bara livsmedelslistor. Skulle vi senare behöva mer kapacitet eller dataskydd flyttar vi projektet till betald nivå (genom att koppla fakturering).
- AI-anropet läggs bakom ett eget tjänstelager i backend så att vi kan byta modell eller leverantör utan att röra frontend.
