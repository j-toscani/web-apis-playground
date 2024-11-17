import { serveDir } from "jsr:@std/http/file-server";
import Home from "./app/index.ts";
import { route } from "jsr:@std/http/unstable-route";

const routes = [
  {
    pattern: new URLPattern({ pathname: "/public/*" }),
    handler: (req: Request) => serveDir(req),
  },
  Home,
].flat();

Deno.serve(route(routes, () => new Response("Not found", { status: 404 })));
