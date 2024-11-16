type FileRoute = Partial<{
  GET: (req: Request) => Response;
  PUT: (req: Request) => Response;
  POST: (req: Request) => Response;
  DELETE: (req: Request) => Response;
}>;

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;
  let module: FileRoute;

  try {
    module = await import(
      `.${path.endsWith("/") ? path : `${path}/`}handler.ts`
    );
  } catch (_error) {
    return new Response("Not found", { status: 404 });
  }

  if (method in module) {
    return module[method as keyof FileRoute]!(req);
  }

  return new Response("Method not implemented", { status: 501 });
}

Deno.serve(handler);
