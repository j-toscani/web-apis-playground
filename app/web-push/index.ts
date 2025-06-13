import { sendJSX } from "@lib/response.ts";
import { serveFile } from "jsr:@std/http/file-server";
import Home from "./page.tsx"
import routes from "./api.ts"
import { DOMAttributes, ReactElement } from "react";

const BASE_PATH = '/web-push'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['button-request-access']: DOMAttributes<any> & { children: ReactElement };
      ['button-subscribe-to-push']: DOMAttributes<any> & { children: ReactElement };
      ['button-unsubscribe-to-push']: DOMAttributes<any> & { children: ReactElement };
      ['button-notify-me']: DOMAttributes<any> & { children: ReactElement };
    }
  }
}

export default routes.concat([
    {
        pattern: new URLPattern({ pathname: `${BASE_PATH}/` }),
        handler: () => sendJSX(Home())
    },
    {
        pattern: new URLPattern({ pathname: `${BASE_PATH}/script.js` }),
        handler: (req: Request) => serveFile(req, `${import.meta.dirname}/script.js`)
    },
    {
        pattern: new URLPattern({ pathname: `${BASE_PATH}/registerSW.js` }),
        handler: (req: Request) => serveFile(req, `${import.meta.dirname}/registerSW.js`)
    },
    {
        pattern: new URLPattern({ pathname: `${BASE_PATH}/sw.js` }),
        handler: (req: Request) => serveFile(req, `${import.meta.dirname}/sw.js`)
    },
    {
        pattern: new URLPattern({ pathname: `${BASE_PATH}/style.css` }),
        handler: (req: Request) => serveFile(req, `${import.meta.dirname}/style.css`)
    },
    {
        pattern: new URLPattern({ pathname: `${BASE_PATH}/img.jpg` }),
        handler: (req: Request) => serveFile(req, `${import.meta.dirname}/img.jpg`)
    }
])