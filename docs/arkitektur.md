# Arkitektur — lokal databas och planerad AI-gateway

**Status (2026-11-19, sprint 2):** Datalagret och matförrådets första UI är mergade till `main` via PR #122. US-03/US-04 (ändra mängd, ta bort med bekräftelse), numeriskt tangentbord, skalor och fyra Vitest-testfiler är implementerade på PR #130-branchen (PR:n väntar på review/merge). **Gemini-modellen och AI-kontraktet är valda och dokumenterade för #125; API-nyckeln är ännu inte verifierad och varken Edge Function eller receptflödet är byggda.** Receptspåret finns i sprint 2 som #22 (delkort #125–#129), #23 och #24.

## Översikt

```mermaid
flowchart TD
  subgraph Phone[Användarens telefon]
    UI[Expo / React Native]
    S[Screens: IngredientsScreen + Add/EditIngredientScreen]
    V[features/inventory: skalor, validering och enheter]
    R[Repository och useLiveQuery]
    DB[(SQLite på enheten)]
    UI --> S
    S --> V
    S --> R
    V --> R
    R --> DB
    DB -->|"ändringshändelse"| R
  end
  S -.->|"planerad: HTTPS vid receptbegäran"| Edge[Supabase Edge Function - Deno / TypeScript]
  Edge -.->|"planerad: API-nyckel från serverhemlighet"| AI[Google Gemini 3.8 Flash - vald, ej integrerad]
  AI -.->|"planerad: strukturerat recept"| Edge
  Edge -.->|"planerad: validerat JSON-svar"| S
```

Heldragna delar finns i koden idag. Streckade delar är målarkitektur och är **inte** byggda.

**Två olika ansvar:** SQLite lagrar *data på telefonen*. Supabase ska **endast** användas för att köra en Edge Function som säkert anropar AI; ingen Supabase PostgreSQL-databas krävs för MVP:n.

## 1. Matförrådet: helt lokalt

Implementerat i sprint 1–2:

- Inventariet sparas per appinstallation med `expo-sqlite` i databasen `imhungry.db`.
- Drizzle ORM ligger bakom `features/inventory/repository.ts`. Skärmarna innehåller ingen SQL.
- `IngredientsScreen` läser via `useInventoryItems` (`useLiveQuery`). Listan uppdateras automatiskt när `inventory_items` ändras och visar laddning, tomt läge och fel.
- `AddIngredientScreen` använder numeriskt tangentbord, en skalväljare (`scales.ts`) och `parseIngredientInput`. Skalor räknas om med flyttalsavrundning till basenheterna g/ml/st innan `useAddIngredient` sparar. Formuläret öppnas som modal från fliken **Råvaror**.
- `EditIngredientScreen` öppnas som modal via `/edit-ingredient?id=<id>`, validerar med `parseQuantityInput` och skriver med `useUpdateIngredient`.
- `IngredientsScreen` tar bort råvaror via `useRemoveIngredient` efter bekräftelse (`Alert.alert` på native, `window.confirm` på webb).
- Appen är låst till ljust läge (`userInterfaceStyle: "light"`) och använder primärfärgen `#208AEF` i hela flödet.
- SQLite-begränsningar skyddar lagrade värden även om TypeScript-validering missas: `quantity > 0` och `unit in ('g', 'ml', 'qty')`.
- Drizzle Kit skapar granskade, versionshanterade migrationer som körs vid appstart innan databasfrågor utförs.
- Två migrationer finns: `0000_freezing_rick_jones.sql` skapar tabellen och `0001_woozy_the_order.sql` lägger till `CHECK`-begränsningarna och bevarar befintliga rader.
- Inventariet fungerar utan internet. Det finns **ingen** automatisk säkerhetskopia, kontosynk eller överföring mellan telefoner.

**Ännu inte implementerat:** mat-humör, receptflöde och Supabase Edge Function. Home-fliken är fortfarande en placeholder.

## 2. Receptbegäran: design fastställd, implementation återstår

**Beslut 2026-11-19:** Använd `gemini-3.8-flash` som primär modell och `gemini-3.5-flash-lite` som manuell reserv. Se [AI-integrationsdesignen och kontrakt v1](ai-integration.md) för exakta JSON-fält, tillåtna basenheter (`g`, `ml`, `qty`), felkoder, mängdkontroll och verifiering av gratis API-åtkomst. Detta flöde är **inte byggt** (status sprint 2). Så här ska det fungera när det byggs:

1. Användaren väljer mat-humör och trycker på knappen för receptförslag.
2. Mobilappen hämtar ett **ögonblicksutdrag** ur lokal SQLite. Bara nödvändiga råvaror, mängder, enheter och humör skickas över HTTPS.
3. Supabase Edge Function (Deno/TypeScript) validerar indata, begränsar tillåtna fält och rimlig storlek och anropar AI-leverantören med API-nyckel från serverlagrad hemlighet.
4. Funktionen validerar AI-svarets struktur och grundläggande receptbegränsningar. Den skickar tillbaka ett JSON-resultat eller ett tydligt fel (t.ex. timeout, tjänsten otillgänglig, kvot nådd).
5. Appen validerar att föreslagna ingredienser refererar till **befintliga inventory-ID:n med korrekta basenheter och tillgängliga sammanlagda mängder**, först mot snapshoten och sedan mot aktuellt lager om något hunnit ändras. Om receptet inte är giltigt visas en begriplig fel-/alternativvy. Ingenting dras automatiskt från lagret.

**Begränsning:** Edge Function har ingen direkt insyn i SQLite och kan därför **inte oberoende verifiera telefonens verkliga saldo**. Den kan validera mot den inskickade listan. Appen ansvarar för kontrollen mot lagret på enheten och eventuell förändring sedan begäran gjordes.

## 3. Säkerhet och missbruksskydd

- **Aldrig:** Lägg en privat Gemini/OpenAI-nyckel i React Native-kod, Git, apppaketet eller `EXPO_PUBLIC_*`.
- **Serverhemligheter:** Lagra AI-nyckeln via Supabases hantering av Edge Function-secrets.
- **Ingen inloggning i MVP:n:** En funktion som går att anropa utan användarautentisering kan utnyttjas av obehöriga. En publik/`verify_jwt = false`-konfiguration är **inte** ett missbruksskydd. Innan funktionen exponeras publikt måste ni bestämma praktiska skydd som rate limiting, kostnadskvoter, övervakning och lämplig anropskontroll. En publik/anon-nyckel i appen är inte hemlig.
- **Indatavalidering:** Begränsa antal råvaror, namn- och textlängder, mängder och tillåtna humör; avvisa oväntade fält och osäkert stora anrop.
- **Svar:** Begär strukturerat JSON från Gemini och validera mot [kontrakt v1](ai-integration.md). Kontrollera ID, enhet och totalmängd mot lagerdata; modellens resultat är opålitligt tills det verifierats.
- **Dataminimering:** Skicka inte identitet, enhets-ID eller andra personuppgifter för receptbegäran när det inte behövs.
- **Offline-fel:** Visa tydligt när AI-funktionen inte kan nås. Matförrådet ska fortsätta fungera.

## 4. Mappstruktur

```text
mobile/
  src/
    app/                       # Expo Router: endast routes
      _layout.tsx              # Rot-Stack + DatabaseProvider
      add-ingredient.tsx       # Modal route
      edit-ingredient.tsx      # Modal route
      (tabs)/
        _layout.tsx            # Home + Råvaror
        index.tsx              # Home (placeholder)
        ingredients/index.tsx  # Tunn route
    screens/                   # Skärmkomponenter
      IngredientsScreen.tsx
      AddIngredientScreen.tsx
      EditIngredientScreen.tsx
    features/
      inventory/               # Enheter, skalor, validering, repository, 4 tester
      recipes/                 # Planerad: UI, anropsklient, svarskontroll
    db/
      client.ts                # Memoiserad Drizzle-instans (useDatabase)
      provider.tsx             # SQLiteProvider + migrationer vid start
      schema.ts                # Drizzle-schema (sanningskälla)
  drizzle/                     # Genererade SQL-migrationer och metadata
supabase/functions/
  generate-recipe/             # Planerad: Deno/TypeScript, validering + AI-gateway
```

Routes i `src/app/` hålls tunna: de importerar skärmar från `src/screens/` och domänlogik från `src/features/`. `db/` innehåller allt som rör databasen, så skärmar och features slipper SQL. `features/inventory/` har det delade datalagret för matförrådet. `features/recipes/` och `supabase/` skapas när receptflödet startar.

## 5. Teknisk verifiering

**Implementerat i sprint 1–2:**

- Lista, tomt läge och felvy är implementerade mot lokal SQLite.
- Lägga till, ändra mängd och bekräftad borttagning är implementerade med delad validering och repository-hooks.
- Skalor räknas om och avrundas till basenheter; fyra Vitest-testfiler täcker validering, skalor, enheter och migrationer.

**Automatiskt verifierat:**

- Ogiltig mängd/enhet stoppas av validering och av SQLite `CHECK`-begränsningar (täcks av `validation.test.ts` och `migrations.test.ts`); skalor och flyttalsavrundning täcks av `scales.test.ts`.
- Migration från tom installation och från föregående databasversion bevarar existerande data (testas av `migrations.test.ts`).
- `npx tsc --noEmit`, `npm run lint` och `npx vitest run` passerar; CI kör samma kontroller.

**Manuellt att verifiera i samband med review:**

- Att listan uppdateras direkt efter save och att datan finns kvar efter appomstart.
- Att flödet fungerar på både native och webb, inklusive modalens stängning och tangentbord.

**Återstår att verifiera när receptflödet byggs:**

- AI-funktionen klarar ogiltiga JSON-requests, timeout, 429, felaktigt AI-svar och otillgängligt nätverk.
- Inga hemligheter förekommer i mobilappens byggda kod eller Git.
- Receptets ingredienser och mängder kontrolleras mot den lokala inventarie-snapshoten.

## Beslut och externa referenser

- [Beslutsloggen](beslutslogg.md), beslut 03, 06–07 · [AI-integrationsdesign och API-kontrakt](ai-integration.md) (#125).
- [MVP](mvp.md) · [Databasschema](databasschema.md) · [Sprint 1](sprintar/sprint-1/planning.md).
- [Expo SQLite](https://docs.expo.dev/versions/v58.0.0/sdk/sqlite/) · [Drizzle / Expo SQLite](https://orm.drizzle.team/docs/sqlite/connect-expo-sqlite) · [Supabase Edge Functions](https://supabase.com/docs/guides/functions).

**Senast uppdaterad:** 2026-11-19 (sprint 2; #125 dokumenterat, inget AI-anrop implementerat).
