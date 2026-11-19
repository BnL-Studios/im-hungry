import { handle } from "./handler.ts";

Deno.serve({ hostname: "127.0.0.1", port: 8787 }, (req) => handle(req));
