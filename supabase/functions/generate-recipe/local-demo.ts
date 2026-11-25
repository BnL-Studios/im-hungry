// Lokal demo: kör handle() på port 8787. Kräver RECIPE_LOCAL_DEMO=1.
import { handle } from "./handler.ts";

Deno.serve({ port: 8787 }, handle);
