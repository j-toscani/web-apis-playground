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

export async function sendFile(path: string, fileType: string) {
  try {
    const file = await Deno.readFile(path);
    return new Response(file, {
      headers: {
        "content-type": fileType,
      },
    });
  } catch (_) {
    return new Response("File not found", { status: 404 });
  }
}
