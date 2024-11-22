import { serveDir } from "jsr:@std/http/file-server";
import WebPush from "./app/web-push/index.ts";
import Home from "./app/index.ts";
import { route } from "jsr:@std/http/unstable-route";
import { sendHMREvent } from "./src/hmr.ts"

const routes = [
  {
    pattern: new URLPattern({ pathname: "/_events" }),
    handler: sendHMREvent
  },
  {
    pattern: new URLPattern({ pathname: "/public/*" }),
    handler: (req: Request) => serveDir(req),
  },
  WebPush,
  Home,
].flat();

Deno.serve(route(routes, () => new Response("Not found", { status: 404 })))
