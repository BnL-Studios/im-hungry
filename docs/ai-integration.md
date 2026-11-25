# AI-integration — beslut och kontrakt (sprint 3)

**Beslutad design:** 2026-11-19 · **Status (2026-11-25):** kontrakt v1, Edge Function och mobilflöde är implementerade på branchen `screen-and-page-for-generate-recipe`. Receptgenerering är manuellt testad i appen med riktig Gemini-nyckel. GitHub-issuesen #143 och #129 är öppna tills PR:en mergas; #135 och missbruksskydd (#138) är kvar.

Relaterade kort: [#125](https://github.com/BnL-Studios/im-hungry/issues/125) (design), [#127](https://github.com/BnL-Studios/im-hungry/issues/127) (modell och gratis API-åtkomst), [#128](https://github.com/BnL-Studios/im-hungry/issues/128) (integration), [#126](https://github.com/BnL-Studios/im-hungry/issues/126) (generera-sida), [#129](https://github.com/BnL-Studios/im-hungry/issues/129) (receptvy), [#22](https://github.com/BnL-Studios/im-hungry/issues/22) (US-05), [#23](https://github.com/BnL-Studios/im-hungry/issues/23) (US-68), [#24](https://github.com/BnL-Studios/im-hungry/issues/24) (US-67).

## 1. Val av modell

- **Designbeslut:** Google Gemini 3.8 Flash, API-ID `gemini-3.8-flash`, är den prioriterade modellen för receptkvalitet.
- **Kodens standard:** `gemini-3.5-flash-lite` används om `GEMINI_MODEL` inte sätts. Sätt `GEMINI_MODEL=gemini-3.8-flash` på servern för att köra designvalet.
- **Reserv:** `GEMINI_BACKUP_MODEL` aktiverar ett extra försök med en annan modell **endast när den är satt**. Koden gör två försök med primärmodellen och därefter ett reservförsök; standardkonfigurationen har alltså ingen reserv.
- **Motivering:** båda listas med kostnadsfri text-in- och utdata på Gemini API:s Free Tier. 3.8 Flash stöder strukturerad JSON och ger mer utrymme för receptkvalitet; Flash-Lite fungerar som snabb standard i den implementerade koden.
- **Verifierat i teamet:** riktiga anrop ger recept i appen. Kontrollera fortfarande i **vårt** AI Studio-projekt vilka RPM/TPM/RPD-gränser som gäller och om konto-/åldersverifiering krävs; gratisnivå betyder inte obegränsade anrop.
- **Kostnad:** undvik att aktivera fakturering för att kringgå gratiskvoten utan ett nytt gemensamt beslut. Hantera 429 och slut på kvot som fel. Sätt inga fasta kvotsiffror i kod eller dokument, de kan ändras.
- **Dataskydd:** Gemini Free Tier kan använda inskickat innehåll för produktförbättring. Skicka enbart minsta nödvändiga inventariedata, aldrig kontouppgifter, identifierare för enhet eller hemligheter. Informera användaren före offentlig användning.

Verifierat 2026-11-19 i [Gemini 3.8 Flash-modellkort](https://aistudio.google.com/docs/models/gemini-3.8-flash), [Flash-Lite-modellkort](https://aistudio.google.com/docs/models/gemini-3.5-flash-lite), [API-priser](https://aistudio.google.com/docs/pricing), [projektspecifika gränser](https://aistudio.google.com/docs/rate-limits) och [villkor](https://ai.google.dev/gemini-api/terms).

## 2. Arkitektur och ansvar

`MVP-beslut 2026-11-19:` Receptgenerering har **ett enda indatafält** (`ingredients`) och svarar med **exakt fyra fält** vid framgång: `title`, `ingredients`, `steps`, `estimatedCookingTime`. Ingen `mood`, val av kök, portionsstorlek, språkparameter, användarprofil eller annat ingår i request v1. Mat-humör (US-06) skjuts upp till efter denna MVP.

```mermaid
flowchart TD
  UI[Generate Recipe-modalen] --> SNAP[Inventory-snapshot via repository]
  DB[(Lokal SQLite + Drizzle)] --> SNAP
  SNAP -->|HTTPS: endast ingredients| EDGE[Supabase Edge Function: generate-recipe]
  EDGE -->|GEMINI_API som serverhemlighet| GEM[Gemini - standard gemini-3.5-flash-lite]
  GEM -->|Strukturerad JSON| EDGE
  EDGE -->|4-fältsrecept eller HTTP-fel| CLIENT[features/recipes: schema- och lagerkontroll]
  CLIENT --> RESULT[/recipe eller begripligt felläge i modalen]
```

- **Mobilen** äger inventariet lokalt och skickar en ögonblicksbild endast när användaren trycker på Generera. Den validerar svaret mot denna snapshot och aktuellt lager innan receptet markeras som tillagningsbart. Genereringen förändrar aldrig inventariet.
- **Edge Function** i `supabase/functions/generate-recipe/` är ett litet Deno/TypeScript-lager (`index.ts`, `handler.ts`, `core.ts`) som validerar request och AI-svar, använder serverhemligheten och returnerar kontraktet nedan eller ett tydligt HTTP-fel. Den kan inte läsa mobilens SQLite direkt.
- **Gemini** skapar ett recept utifrån enbart listade råvaror; appen och Edge Function är ansvariga för tillgänglighetskontrollen.
- Ingen separat Java/Node-server eller molnlagring av skafferiet behövs. Mobilens routes hålls i `src/app/`, skärmar i `src/screens/` och recept-API/validering i `src/features/recipes/`.

## 3. API-kontrakt v1 — minsta möjliga

**Endpoint:** `POST /functions/v1/generate-recipe` med `Content-Type: application/json`. Endpointens åtkomstskydd beskrivs i avsnitt 5.

### Request (enda toppnivåfältet: ingredients)

```json
{
  "ingredients": [
    { "id": 1, "name": "Kokt ris", "quantity": 500, "unit": "g" },
    { "id": 2, "name": "Ägg", "quantity": 4, "unit": "qty" },
    { "id": 3, "name": "Lök", "quantity": 2, "unit": "qty" }
  ]
}
```

Ingrediensposterna motsvarar befintliga SQLite-fält: positivt heltals-`id`, `name` (1–80 tecken), positivt ändligt `quantity` och `unit` (`g`, `ml` eller `qty`; i användargränssnittet visas `qty` som `st`). Begäran tillåter exempelvis 1–50 unika ingredienser. Avvisa okända toppnivåfält, dubblett-ID, otillåtna enheter och för stora requests. Den *enda* begäran som skickas till AI-flödet är denna ingredienslista — ingen `mood` eller annan preferens.

### Lyckat svar (HTTP 200: exakt fyra toppnivåfält)

```json
{
  "title": "Stekt kokt ris med ägg och lök",
  "ingredients": [
    { "id": 1, "quantity": 200, "unit": "g" },
    { "id": 2, "quantity": 2, "unit": "qty" },
    { "id": 3, "quantity": 1, "unit": "qty" }
  ],
  "steps": [
    "Värm det redan kokta riset i en stekpanna.",
    "Tillsätt finhackad lök och stek under omrörning.",
    "Rör ner äggen och tillaga tills de är genomstekta."
  ],
  "estimatedCookingTime": 20
}
```

- `title`: receptets namn, icke-tom sträng.
- `ingredients`: använda råvaror med `id` från requesten, positiv `quantity` och samma `unit` som i inventariet. Namnet hämtas från snapshoten i appen — AI behöver inte skapa det en gång till. Implementeringen tillåter **endast unika ID:n**; dubbletter avvisas i stället för att summeras.
- `steps`: en icke-tom lista med tydliga, ordnade tillagningssteg.
- `estimatedCookingTime`: uppskattad **total tillagningstid i minuter**, positivt heltal.

**Ingen `status`, `recipe`-wrapper, metadata eller extra inställningar i ett lyckat svar.** Fältnamnen är kontraktets exakta stavning och ska användas likadant i Supabase, mobilapp, tester och receptskärm.

### Fel (separat från lyckat recept)

När inget rimligt recept kan genereras eller anropet misslyckas returneras ett HTTP-fel; detta är **inte** ett recept med fyra tomma fält.

```json
{
  "error": {
    "code": "NO_RECIPE",
    "message": "Inget recept kan göras med dessa råvaror och mängder."
  }
}
```

- `NO_RECIPE` (422): tillgängligt lager räcker inte till ett giltigt recept; visa begripligt meddelande.
- `INVALID_REQUEST` (400): tom/ogiltig ingredienslista, dubblett-ID, otillåten enhet eller felaktig JSON.
- `RATE_LIMITED` (429): API-kvot eller rate limit nådd.
- `MODEL_UNAVAILABLE` (502/503), `MODEL_ERROR` (502), `INVALID_RECIPE` (502), `TIMEOUT` (504) och `INTERNAL_ERROR` (500): tekniska fel utan att exponera hemligheter eller leverantörens råa internfel. `METHOD_NOT_ALLOWED` (405) returneras för andra metoder än POST/OPTIONS.
- Nätverksfel kan uppstå utan HTTP-svar och ska visas tydligt i appen. Inventariet ska fortfarande fungera offline.

## 4. Receptregler och validering

1. Prompten kräver att **enbart inskickade råvaror** används. Vatten, salt och stekfett får antas finnas som basvaror utan inventory-ID; andra kryddor måste finnas i listan. Ingen implicit inköpslista.
2. Begär Geminis **structured output / JSON Schema** för de fyra fälten ovan. Validera ändå resultatet i Edge Function och mobilen: modellen är inte en källa till sanning om tillgänglighet.
3. Varje `ingredients[].id` måste finnas i requestens snapshot. Enheten måste matcha och den föreslagna mängden per unikt ID får inte överstiga tillgänglig mängd; dubblett-ID avvisas. Eventuella toleranser får endast avse dokumenterad flyttalsavrundning, aldrig faktisk brist.
4. Försök inte rätta modellens recept genom att automatiskt lägga till eller öka lagerrader. Avvisa ogiltigt resultat med `INVALID_RECIPE` eller `NO_RECIPE` och visa inget som tillagningsbart.
5. Om inventariet ändras medan anropet körs kontrollerar mobilen mot nuvarande saldo innan receptet visas. `toRecipeView` döljer dessutom rader utan snapshot-namn eller med mängd ≤ 0.
6. Receptbegäran är **read-only**: inga råvaror läggs till, ändras eller dras av; resultatet sparas inte permanent i MVP:n.

[Google: Structured outputs](https://aistudio.google.com/docs/structured-output).

## 5. API-nyckel, säkerhet och åtkomst

- Generera en projekt-API-nyckel i [Google AI Studio](https://aistudio.google.com/api-keys). Ett verkligt API-anrop är testat i appen och ger recept. Kontrollera löpande att projektet har rätt gratiskvot och tillgång till vald modell.
- **Viktigt:** koden läser nyckeln från `Deno.env.get("GEMINI_API")` i `core.ts`, inte från `GEMINI_API_KEY` som tidigare dokumentation angav. För lokal körning används en ignorerad env-fil (`supabase/.env` enligt `supabase/.env.example`). Lägg **aldrig** privat nyckel i Git eller `EXPO_PUBLIC_*`.
- **Modellval:** designen föreskriver `gemini-3.8-flash`, men koden defaultar till `gemini-3.5-flash-lite`. Sätt den icke-hemliga `GEMINI_MODEL=gemini-3.8-flash` i Supabase för att köra designvalet. `GEMINI_BACKUP_MODEL` aktiverar ett extra reservförsök när den sätts.
- En app utan inloggning kan inte säkra en publik funktion genom att endast skicka en publikt inbyggd nyckel. `verify_jwt = false` är **inte** ett missbruksskydd. Kräv före publik driftsättning konkreta request-begränsningar och serverbaserad rate limiting/kvot, övervakning samt ett medvetet åtkomstbeslut.
- För sprintdemo: börja med en lokal eller åtkomstbegränsad testmiljö; exponera inte en oskyddad kostnadsdrivande endpoint. Logga aldrig fulla skafferi-payloads eller API-nycklar.
- Se [Supabase Secrets](https://supabase.com/docs/guides/functions/secrets), [Securing Edge Functions](https://supabase.com/docs/guides/functions/auth) och [Rate limiting](https://supabase.com/docs/guides/functions/examples/rate-limiting).

## 6. Implementationsordning och acceptans

- [x] **#125 — Designbeslut:** modell, gränser, ansvar, request/response, fel och valideringsstrategi dokumenterade och mergade via #132.
- [x] **#127 — Modellval:** `gemini-3.8-flash` är designval; koden kör `gemini-3.5-flash-lite` som standard och kan sätta primär/reservmodell via env.
- [x] **#127 — Konto:** riktiga anrop med serverlagrad nyckel ger recept i appen. Kvotgränser kan ändras och följs upp i AI Studio.
- [x] **#128 — Kod:** Edge Function validerar indata/AI-svar och hanterar 429, timeout och fel; deployad via #140 och testad i CI.
- [x] **#126 — Kod:** mobilen läser SQLite-snapshot, anropar tjänsten och visar laddning, tomt läge och fel i modalen.
- [x] **#129 / US-68 — Kod på branch:** `/recipe` presenterar titel, tid, råvaror och steg. Kortet är öppet på GitHub tills PR:en mergas.
- [x] **US-05 / US-67 — Kod:** klienten läser lagret igen och avvisar ändrade/otillräckliga mängder; genereringen skriver aldrig till SQLite. Täckt av `generate.test.ts`, `view-model.test.ts` och kontraktstester.
- [ ] **#135:** flytta mängderna in i tillagningsstegen. Inte implementerat.

**Status:** dokumentet beskriver både designbeslutet och koden på feature-branchen. Issue/PR-status är separat från kodstatus.

## Kör receptflödet

**Hostat (normalt läge):** kopiera `mobile/.env.example` till `mobile/.env` och ange `EXPO_PUBLIC_SUPABASE_URL` samt `EXPO_PUBLIC_SUPABASE_ANON_KEY`. Klienten bygger själv URL:en `/functions/v1/generate-recipe`; alternativt kan hela URL:en sättas med `EXPO_PUBLIC_GENERATE_RECIPE_URL`. Starta om Expo, lägg till råvaror, öppna fliken **Generate Recipe** och tryck på **Generera recept**. Lyckat resultat visas på `/recipe`.

**Lokal demo (valfritt):** kopiera `supabase/.env.example` till `supabase/.env`, fyll i `GEMINI_API` och kör från repots rot:

```sh
RECIPE_LOCAL_DEMO=1 deno run \
  --env-file=supabase/.env \
  --allow-env=RECIPE_LOCAL_DEMO,DENO_DEPLOYMENT_ID,GEMINI_API,GEMINI_MODEL,GEMINI_BACKUP_MODEL \
  --allow-net=127.0.0.1:8787,generativelanguage.googleapis.com \
  supabase/functions/generate-recipe/local-demo.ts
```

`local-demo.ts` anropar `handle()` från `handler.ts` och lyssnar på port 8787. `handler.ts` kräver `RECIPE_LOCAL_DEMO=1`, loopback-origin och avsaknad av `DENO_DEPLOYMENT_ID`; den hostade `index.ts` fail-close med 403. Sätt `EXPO_PUBLIC_GENERATE_RECIPE_URL=http://127.0.0.1:8787/functions/v1/generate-recipe` i `mobile/.env` och starta om Expo. Android-emulatorn behöver `adb reverse tcp:8787 tcp:8787`. Använd aldrig en tunnel/publik proxy för lokal demo.

Installera Deno 2 för att köra Edge Function-testerna:

```sh
deno test --allow-env=RECIPE_LOCAL_DEMO,DENO_DEPLOYMENT_ID supabase/functions/generate-recipe
```

Gemini-nyckeln används enbart på servern (`GEMINI_API`, se avsnitt 5). Innan bred publicering behövs åtkomstskydd och kvotbegränsning (#138).

`generateFromInventory` returnerar en `RecipeResult` med `recipe` (de fyra API-fälten) och `snapshot` (namn per ingrediens-ID). Resultatet hålls i `RecipeProvider` och visas på `/recipe`. Tjänsten läser lagret igen före visning och skriver aldrig till SQLite.

**Senast uppdaterad:** 2026-11-25.
