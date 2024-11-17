import { renderToReadableStream } from "npm:react-dom/server";

export async function sendJSX(page: JSX.Element, status = 200) {
  const content = await renderToReadableStream(page);
  return new Response(content, {
    status,
    headers: {
      "content-type": "text/html",
    },
  });
}
