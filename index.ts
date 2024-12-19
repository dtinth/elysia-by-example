import { $, type Server } from "bun";
import { execa } from "execa";
import type { TestRequest } from "./src/docs";

async function* doc() {
  const glob = new Bun.Glob("**/example.ts");
  for await (const file of glob.scan("examples")) {
    yield ``;
    const module = await import(`./examples/${file}`);
    yield `<table>`;
    yield `<colgroup><col width="1000"><col width="1000"></colgroup>`;
    yield `<tbody><tr><td width="1000" valign="top">`;
    yield ``;
    yield module.default.trim();
    yield ``;
    yield "<img src='sizer.png' width='8000' height='1'>";
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
    yield ``;
    yield "<img src='sizer.png' width='7000' height='1'>";
    yield ``;
    yield `</td></tr></tbody></table>`;
    if (module.tests) {
      using tester = new Tester(module.app);
      for (const test of module.tests) {
        yield "";
        yield `<table><tr><td><details><summary>${test.title}</summary>`;
        yield "";
        await tester.run(test.request);
        yield tester.log.join("\n");
        yield "";
        yield "</details></td></tr></table>";
      }
    }
  }
}

class Tester {
  server: Server;
  log: string[] = [];
  constructor(private app: { fetch: any }) {
    this.server = Bun.serve({
      port: 0,
      hostname: "localhost",
      fetch: async (request) => {
        return await app.fetch(request);
      },
    });
  }
  [Symbol.dispose]() {
    this.server.stop(true);
  }
  async run(request: TestRequest) {
    let command = "curl -s -D-";
    command += " ";
    command += $.escape(new URL(request.url, this.server.url).href);
    this.log.push("```sh-session");
    this.log.push(
      `$ ${command.replace(this.server.url.origin, "http://localhost:3000")}`
    );
    this.log.push((await execa(command + " 2>&1", { shell: true })).stdout);
    this.log.push("```");
  }
}

for await (const chunk of doc()) {
  console.log(chunk);
}
