import { $, type Server } from "bun";
import { groupBy } from "lodash-es";
import { randomUUID } from "node:crypto";
import { dirname } from "node:path";

async function main() {
  const glob = new Bun.Glob("**/*.example.ts");
  const groups = groupBy(Array.from(glob.scanSync("examples")), (file) =>
    dirname(file)
  );
  for (const [group, exampleFiles] of Object.entries(groups)) {
    exampleFiles.sort();
    const out: string[] = [];
    const generatePlaceholder = () => ":" + randomUUID() + ":";
    const placeholders = new Map<string, string>();
    for (const file of exampleFiles) {
      const { default: app } = await import(`./examples/${file}`);
      using tester = new Tester(app);
      const lines = new LineParseState(
        (await Bun.file(`examples/${file}`).text()).trim().split("\n")
      );
      const actions: (() => Promise<void>)[] = [];
      const parseProse = (): void => {
        while (lines.isComment() || lines.isEmpty()) {
          if (lines.next.trimStart().startsWith("//$ ")) {
            parseCommand();
          } else {
            out.push(
              lines
                .consume()
                .trimStart()
                .slice(3)
                .replaceAll("$EXAMPLE", `examples/${file}`)
            );
          }
        }
        return parseCode();
      };
      const parseCode = (): void => {
        skipEmptyLines();
        if (lines.ended) return;
        out.push("```ts [file]");
        while (!lines.ended) {
          if (lines.next.trim() === "// [prose]") {
            lines.consume();
            out.push("```", "");
            return parseProse();
          }
          out.push(lines.consume().trimEnd());
        }
        out.push("```");
      };
      const skipEmptyLines = (): void => {
        while (lines.isEmpty()) {
          lines.consume();
        }
      };
      const parseCommand = (): void => {
        const command: string[] = [];
        while (lines.isComment()) {
          const line = lines
            .consume()
            .trim()
            .replace(/^\/\/[$]?\s*/, "");
          command.push(line);
          if (!line.endsWith("$")) break;
        }
        const placeholder = generatePlaceholder();
        out.push("", placeholder, "");
        actions.push(async () => {
          let rawCmd = command.join("\n");
          const commentRegex = /#\s*(.*?)\s*$/;
          const commentMatch = rawCmd.match(commentRegex);
          let title = "Example request";
          if (commentMatch) {
            rawCmd = rawCmd.replace(commentRegex, "");
            title = "Example request: " + commentMatch[1].trim();
          }
          const runCmd = rawCmd.replaceAll("$SERVER", tester.server.url.origin);
          const showCmd = rawCmd.replaceAll("$SERVER", "http://localhost:3000");
          const result = await $`bash -c ${runCmd} 2>&1`.text();
          placeholders.set(
            placeholder,
            [
              "::: details " + title,
              "",
              '<div style="margin-bottom: 0.5rem">',
              "",
              "```sh",
              showCmd,
              "```",
              "",
              "</div>",
              "",
              "```http",
              result,
              "```",
              ":::",
            ].join("\n")
          );
        });
      };
      parseProse();
      for (const action of actions) {
        await action();
      }
    }
    let outText = out.join("\n");
    for (const [placeholder, replacement] of placeholders) {
      outText = outText.replaceAll(placeholder, replacement);
    }
    const outFile = `docs/examples/${group}.md`;
    Bun.write(outFile, outText.replace(/\r\n/g, "\n"));
    console.log(`Wrote ${outFile}`);
  }
}

class LineParseState {
  private index = 0;
  constructor(private lines: string[]) {}
  get next() {
    return this.lines[this.index];
  }
  get ended() {
    return this.index >= this.lines.length;
  }
  isComment() {
    return !this.ended && this.next.trimStart().startsWith("//");
  }
  isEmpty() {
    return !this.ended && this.next.trim() === "";
  }
  consume() {
    return this.lines[this.index++];
  }
}

class Tester {
  server: Server;
  log: string[] = [];
  constructor(app: { fetch: any }) {
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
}

await main();
