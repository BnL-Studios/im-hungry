# Arkitektur — lokal databas och AI-gateway

**Status:** Datalagret är implementerat; receptflödet återstår. **Uppdaterad:** 2026-11-04.

## Översikt

```mermaid
flowchart TD
  subgraph Phone[Användarens telefon]
    UI[Expo / React Native]
    S[Operationer och validering]
    R[Drizzle ORM / repository]
    DB[(SQLite på enheten)]
    UI --> S --> R --> DB
  end
  UI -->|HTTPS: råvaror, mängder, enheter och humör| Edge[Supabase Edge Function - Deno / TypeScript]
  Edge -->|API-nyckel från server-hemlighet| AI[Google Gemini Flash - eller senare vald AI-tjänst]
  AI -->|Strukturerat recept| Edge
  Edge -->|Validerat JSON-svar| UI
```

**Två olika ansvar:** SQLite lagrar *data på telefonen*. Supabase används **endast för att köra en Edge Function** som säkert anropar AI; ingen Supabase PostgreSQL-databas krävs för MVP:n.

## 1. Matförrådet: helt lokalt

- Inventariet sparas per appinstallation med `expo-sqlite`.
- Drizzle ORM ligger bakom datalager/repositories; skärmar ska inte innehålla SQL.
- Operationer sköter inmatningsvalidering (namn, positiv mängd, giltig enhet).
- SQLite-begränsningar skyddar lagrade värden även om TypeScript-validering missas.
- Drizzle Kit skapar granskade, versionshanterade migrationer som körs vid appstart innan databasfrågor utförs.
- Inventariet fungerar utan internet. Det finns **ingen** automatisk säkerhetskopia, kontosynk eller överföring mellan telefoner.

## 2. Receptbegäran: endast vid användarens begäran

1. Användaren väljer mat-humör och trycker på knappen för receptförslag.
2. Mobilappen hämtar ett **ögonblicksutdrag** ur lokal SQLite. Bara nödvändiga råvaror, mängder, enheter och humör skickas över HTTPS.
3. Supabase Edge Function (Deno/TypeScript) validerar indata, begränsar tillåtna fält och rimlig storlek och anropar AI-leverantören med API-nyckel från serverlagrad hemlighet.
4. Funktionen validerar AI-svarets struktur och grundläggande receptbegränsningar. Den skickar tillbaka ett JSON-resultat eller ett tydligt fel (t.ex. timeout, tjänsten otillgänglig, kvot nådd).
5. Appen validerar att föreslagna ingredienser och mängder är möjliga utifrån **den lokala inventarie-snapshot som användes**. Om receptet inte är giltigt visas en begriplig fel-/alternativvy. Ingenting dras automatiskt från lagret.

**Begränsning:** Edge Function har ingen direkt insyn i SQLite och kan därför **inte oberoende verifiera telefonens verkliga saldo**. Den kan validera mot den inskickade listan. Appen ansvarar för kontrollen mot lagret på enheten och eventuell förändring sedan begäran gjordes.

## 3. Säkerhet och missbruksskydd

- **Aldrig:** Lägg en privat Gemini/OpenAI-nyckel i React Native-kod, Git, apppaketet eller `EXPO_PUBLIC_*`.
- **Serverhemligheter:** Lagra AI-nyckeln via Supabases hantering av Edge Function-secrets.
- **Ingen inloggning i MVP:n:** En funktion som går att anropa utan användarautentisering kan utnyttjas av obehöriga. En publik/`verify_jwt = false`-konfiguration är **inte** ett missbruksskydd. Innan funktionen exponeras publikt måste ni bestämma praktiska skydd som rate limiting, kostnadskvoter, övervakning och lämplig anropskontroll. En publik/anon-nyckel i appen är inte hemlig.
- **Indatavalidering:** Begränsa antal råvaror, namn- och textlängder, mängder och tillåtna humör; avvisa oväntade fält och osäkert stora anrop.
- **Svar:** Begär strukturerat JSON från AI och validera mot ett explicit schema. Modellens resultat är opålitligt tills det verifierats.
- **Dataminimering:** Skicka inte identitet, enhets-ID eller andra personuppgifter för receptbegäran när det inte behövs.
- **Offline-fel:** Visa tydligt när AI-funktionen inte kan nås. Matförrådet ska fortsätta fungera.

## 4. Mappstruktur

```text
mobile/
  src/
    app/                       # Expo Router: endast routes (index, new)
    screens/                   # Skärmkomponenter (AddIngredientScreen)
    features/
      inventory/               # Enheter, validering, repository
      recipes/                 # UI, anropsklient, svarskontroll (senare)
    db/
      client.ts                # Memoiserad Drizzle-instans (useDatabase)
      provider.tsx             # SQLiteProvider + migrationer vid start
      schema.ts                # Drizzle-schema (sanningskälla)
  drizzle/                     # Genererade SQL-migrationer och metadata
supabase/functions/
  generate-recipe/             # Deno/TypeScript, validering + AI-gateway
```

Routes i `src/app/` hålls tunna: de importerar skärmar från `src/screens/` och domänlogik från `src/features/`. `db/` innehåller allt som rör databasen, så skärmar och features slipper SQL. `features/inventory/` har det delade datalagret för matförrådet. `app/new.tsx` visar `screens/AddIngredientScreen.tsx`, som validerar och sparar via det delade datalagret. `supabase/` skapas när receptflödet startar.

## 5. Teknisk verifiering

- Skapa, visa, uppdatera, ta bort och läs råvaror efter appomstart **offline**.
- Migration från tom installation och från föregående databasversion bevarar existerande data.
- Felaktiga mängder/enheter stoppas på flera nivåer.
- AI-funktionen klarar ogiltiga JSON-requests, timeout, 429, felaktigt AI-svar och otillgängligt nätverk.
- Inga hemligheter förekommer i mobilappens byggda kod eller Git.

## Beslut och externa referenser

- [Beslutsloggen](beslutslogg.md), beslut 06–07.
- [MVP](mvp.md) · [Databasschema](databasschema.md).
- [Expo SQLite](https://docs.expo.dev/versions/v58.0.0/sdk/sqlite/) · [Drizzle / Expo SQLite](https://orm.drizzle.team/docs/sqlite/connect-expo-sqlite) · [Supabase Edge Functions](https://supabase.com/docs/guides/functions).
