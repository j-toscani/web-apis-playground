const [path] = Deno.args;
const from = `${import.meta.dirname}/template`;
const to = `${import.meta.dirname}/app/${
  path.endsWith("/") ? path.slice(0, -1) : path
}`;

const dirs = Deno.readDir(from);
await Deno.mkdir(to)

for await (const entry of dirs) {
  if (!entry.isFile) continue;
  await Deno.copyFile(`${from}/${entry.name}`, `${to}/${entry.name}`);
}
