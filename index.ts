async function* doc() {
  const glob = new Bun.Glob("**/example.ts");
  for await (const file of glob.scan("examples")) {
    const module = await import(`./examples/${file}`);
    yield `<table><tbody><tr><td width="400">`;
    yield ``;
    yield module.default.trim();
    yield ``;
    yield `</td><td width="400">`;
    yield ``;
    yield "```ts";
    yield (
      await Bun.file(
        `./examples/${file.replace("/example.ts", "/index.ts")}`
      ).text()
    ).trim();
    yield "```";
    yield "";
    yield `</td></tr></tbody></table>`;
  }
}

for await (const chunk of doc()) {
  console.log(chunk);
}
