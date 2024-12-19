async function* doc() {
  const glob = new Bun.Glob("**/example.ts");
  for await (const file of glob.scan("examples")) {
    yield ``;
    const module = await import(`./examples/${file}`);
    yield `<table><tbody><tr><td width="1000" valign="top">`;
    yield ``;
    yield module.default.trim();
    yield ``;
    yield `</td><td width="1000" valign="top">`;
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
    if (module.tests) {
      for (const test of module.tests) {
        yield "";
        yield `<table><tr><td><details><summary>${test.title}</summary>`;
        yield "";
        yield "TODO";
        yield "";
        yield "</details></td></tr></table>";
      }
    }
  }
}

for await (const chunk of doc()) {
  console.log(chunk);
}
