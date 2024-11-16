export function GET(_req: Request) {
  return new Response(`Moin Moin: ${_req.url}`, { status: 200 });
}
