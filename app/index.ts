import { sendFile, sendJSX } from "@lib/response.ts";
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
        handler: () => sendFile(`${import.meta.dirname}/script.js`, 'text/javascript')
    },
    {
        pattern: new URLPattern({ pathname: `${BASE_PATH}style.css` }),
        handler: () => sendFile(`${import.meta.dirname}/style.css`, 'text/css')
    }
])