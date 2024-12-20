import AnsiToHtml from "ansi-to-html";
import { $, type Server } from "bun";
import { groupBy } from "lodash-es";
import { randomUUID } from "node:crypto";
import { dirname } from "node:path";
import { formatWithOptions } from "node:util";

async function main() {
  const ansi = new AnsiToHtml();
  const glob = new Bun.Glob("**/*.example.ts");
  const groups = groupBy(Array.from(glob.scanSync("examples")), (file) =>
    dirname(file)
  );
  for (const [group, exampleFiles] of Object.entries(groups)) {
    exampleFiles.sort();
    const exampleLink = `https://github.com/dtinth/elysia-by-example/tree/main/examples/${group}`;
    const out: string[] = [
      "<!-- This file is automatically-generated. Do not edit. -->",
      "",
      `<template v-if="false">`,
      "",
      `> [!CAUTION]`,
      `> This file has been automatically generated from the [examples in the \`examples/${group}\` directory.](${exampleLink}).`,
      `> Do not directly edit this file, as it will be overwritten.`,
      `> [[View the live site here.]](https://dtinth.github.io/elysia-by-example/examples/${group}.html)`,
      "",
      "</template>",
      "",
      "",
    ];
    const readme = Bun.file(`examples/${group}/README.md`);
    if (await readme.exists()) {
      out.push(await readme.text());
      out.push("");
    }
    const generatePlaceholder = () => ":" + randomUUID() + ":";
    const placeholders = new Map<string, string>();
    for (const file of exampleFiles) {
      using consoleLog = new ConsoleLogCapture();
      const filePath = `examples/${file}`;
      const { default: app } = await import(`./${filePath}`);
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
                .replaceAll("$EXAMPLE", filePath)
            );
          }
        }
        return parseCode();
      };
      const parseCode = (): void => {
        skipEmptyLines();
        if (lines.ended) return;
        out.push("```ts");
        out.push(`// ${filePath}`);
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
            .replace(/^\/\/[$\s]?\s?/, "");
          command.push(line);
          if (!line.endsWith("\\")) break;
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
          const consoleOutput = consoleLog.consume();
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
              result.replaceAll(tester.server.url.host, "localhost:3000"),
              "```",
              ...(consoleOutput.length > 0
                ? [
                    "",
                    `<div style="margin-top: 0.5rem" class="language-ansi">` +
                      `<span class="lang">console output</span>` +
                      `<pre style="background: black"><code style="color: white">${ansi.toHtml(consoleOutput.join("\n")).split("\n").join("<br>")}</code></pre>` +
                      `</div>`,
                    "",
                  ]
                : []),
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
      outText = outText.replaceAll(placeholder, () => replacement);
    }
    const outFile = `docs/examples/${group}.md`;
    await updateFile(outFile, outText.replace(/\r\n/g, "\n"));
  }
}

async function updateFile(filePath: string, content: string) {
  const file = Bun.file(filePath);
  let shouldWrite = true;
  if (await file.exists()) {
    const existingContent = await file.text();
    const normalize = (s: string) => s.replaceAll(/^Date: .+ GMT/gm, "-");
    if (normalize(existingContent) === normalize(content)) {
      shouldWrite = false;
    }
  }
  if (shouldWrite) {
    await Bun.write(file, content);
    console.log(`Wrote: ${filePath}`);
  } else {
    console.log(`Up-to-date: ${filePath}`);
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

class ConsoleLogCapture {
  log: string[] = [];
  original = console.log;
  constructor() {
    console.log = (...args) => {
      this.log.push(formatWithOptions({ colors: true }, ...args));
    };
  }
  [Symbol.dispose]() {
    console.log = this.original;
  }
  consume() {
    const log = this.log;
    this.log = [];
    return log;
  }
}

class Tester {
  server: Server;
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
