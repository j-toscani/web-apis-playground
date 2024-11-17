import { sendJSX } from "@lib/response.ts";
import { serveFile } from "jsr:@std/http/file-server";
import Home from "./page.tsx"
import routes from "./api.ts"

const BASE_PATH = '/'

export default routes.concat([
    {
        pattern: new URLPattern({ pathname: `${BASE_PATH}` }),
        handler: () => sendJSX(Home())
    },
    {
        pattern: new URLPattern({ pathname: `${BASE_PATH}script.js` }),
        handler: (req: Request) => serveFile(req, `${import.meta.dirname}/script.js`)
    },
    {
        pattern: new URLPattern({ pathname: `${BASE_PATH}style.css` }),
        handler: (req: Request) => serveFile(req, `${import.meta.dirname}/style.css`)
    }
])