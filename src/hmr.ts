const msg = new TextEncoder().encode("data: hello\r\n\r\n");

export function sendHMREvent(_req: Request) {
  const watcher = Deno.watchFs("./app/");
  const body = new ReadableStream({
    async start(controller) {
      for await (const _file of watcher) {
        controller.enqueue(msg);
      }
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
    },
  });
}
