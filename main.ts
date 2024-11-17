import Home from "./app/index.ts";
import { route } from "jsr:@std/http/unstable-route";

const routes = [
  Home
].flat()

Deno.serve(route(routes, () => new Response("Not found", { status: 404 })));
