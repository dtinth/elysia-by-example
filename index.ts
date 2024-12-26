import AnsiToHtml from "ansi-to-html";
import { $, escapeHTML, type Server } from "bun";
import indentString from "indent-string";
import { load } from "js-yaml";
import { groupBy, isEqual } from "lodash-es";
import { randomUUID } from "node:crypto";
import { basename, dirname } from "node:path";
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
    const snapshotPath = `snapshots/${group}.snapshot.yml`;
    const snapshots = new SnapshotManager(snapshotPath);
    const readme = Bun.file(`examples/${group}/README.md`);
    if (await readme.exists()) {
      out.push(await readme.text());
      out.push("");
    }
    const generatePlaceholder = () => ":" + randomUUID() + ":";
    const placeholders = new Map<string, string>();
    for (const file of exampleFiles) {
      const filePath = `examples/${file}`;
      console.log("Running", filePath);
      using consoleLog = new ConsoleLogCapture();
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
        const expectations = parseExpectations();
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
          const newSnapshot: Snapshot = {
            command: showCmd,
            result: result.replaceAll(tester.server.url.host, "localhost:3000"),
            log: consoleOutput.join("\n"),
          };
          const snapshotName = basename(file, ".example.ts") + " " + title;
          const snapshot = await snapshots.resolveSnapshot(
            snapshotName,
            newSnapshot
          );
          for (const expectation of expectations.positive) {
            if (!snapshot.result.includes(expectation)) {
              console.error(`❌ Positive expectation failed: ${expectation}`);
            }
          }
          for (const expectation of expectations.negative) {
            if (snapshot.result.includes(expectation)) {
              console.error(`❌ Negative expectation failed: ${expectation}`);
            }
          }
          placeholders.set(
            placeholder,
            [
              "::: details " + title,
              "",
              '<div style="margin-bottom: 0.5rem">',
              "",
              "```sh",
              snapshot.command,
              "```",
              "",
              "</div>",
              "",
              "```http",
              snapshot.result,
              "```",
              ...(consoleOutput.length > 0
                ? [
                    "",
                    `<div style="margin-top: 0.5rem" class="language-ansi">` +
                      `<span class="lang">console output</span>` +
                      `<pre style="background: black"><code style="color: white">${renderHtml(ansi.toHtml(snapshot.log).split("\n").join("<br/>"))}</code></pre>` +
                      `</div>`,
                    "",
                  ]
                : []),
              ":::",
            ].join("\n")
          );
        });
      };
      const parseExpectations = (): Expectations => {
        const expectations: Expectations = {
          positive: [],
          negative: [],
        };
        while (!lines.ended) {
          const line = lines.next.trim();
          if (line.startsWith("//# expect ")) {
            const text = lines.consume().slice("//# expect ".length).trim();
            for (const m of text.matchAll(/"([^"]+)"|(\S+)/g)) {
              expectations.positive.push(m[1] || m[2]);
            }
          } else if (line.startsWith("//# expect-not ")) {
            const text = lines.consume().slice("//# expect-not ".length).trim();
            for (const m of text.matchAll(/"([^"]+)"|(\S+)/g)) {
              expectations.negative.push(m[1] || m[2]);
            }
          } else {
            break;
          }
        }
        return expectations;
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
    await snapshots.save();
  }
}

function renderHtml(html: string) {
  return `<span v-html="${escapeHTML(JSON.stringify(html))}"></span>`;
}

const normalize = (s: string) =>
  linesToArray(s.replaceAll(/^Date: .+ GMT/gm, "-"));

async function updateFile(filePath: string, content: string) {
  const file = Bun.file(filePath);
  let shouldWrite = true;
  if (await file.exists()) {
    const existingContent = await file.text();
    if (existingContent === content) {
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
      // this.original.apply(console, args);
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

interface Snapshot {
  command: string;
  result: string;
  log: string;
}

const linesToArray = (s: string) =>
  s
    .split(/\r\n|\r|\n/)
    .map((x) => "- " + JSON.stringify(x))
    .join("\n");

class SnapshotManager {
  constructor(private filePath: string) {}
  store?: Record<string, Snapshot>;
  usedNames: Set<string> = new Set();
  dirty = false;

  async resolveSnapshot(snapshotName: string, newSnapshot: Snapshot) {
    const store = await this.getStore();
    if (this.usedNames.has(snapshotName)) {
      const baseName = snapshotName;
      let i = 2;
      while (this.usedNames.has(baseName + " " + i)) i++;
      snapshotName = baseName + " " + i;
    }
    this.usedNames.add(snapshotName);
    const old: Snapshot | undefined = store[snapshotName];
    const oldNormalized = old
      ? {
          command: normalize(old.command),
          result: normalize(old.result),
          log: normalize(old.log),
        }
      : undefined;
    const newNormalized = {
      command: normalize(newSnapshot.command),
      result: normalize(newSnapshot.result),
      log: normalize(newSnapshot.log),
    };
    if (isEqual(oldNormalized, newNormalized)) {
      return old;
    }
    store[snapshotName] = newSnapshot;
    this.dirty = true;
    return newSnapshot;
  }

  async save() {
    if (this.dirty) {
      const file = Bun.file(this.filePath);
      await Bun.write(file, this.serialize(await this.getStore()));
      console.log("Snapshot updated:", this.filePath);
    } else {
      console.log("Snapshot up-to-date:", this.filePath);
    }
  }

  serialize(store: Record<string, Snapshot>) {
    const output: string[] = [];
    for (const key of Object.keys(store).sort()) {
      const snapshot = store[key];
      output.push(JSON.stringify(key) + ":");
      output.push("  command:");
      output.push(indentString(linesToArray(snapshot.command), 4));
      output.push("  result:");
      output.push(indentString(linesToArray(snapshot.result), 4));
      output.push("  log:");
      output.push(indentString(linesToArray(snapshot.log), 4));
    }
    return output.map((x) => x + "\n").join("");
  }

  private async getStore() {
    if (this.store) return this.store;
    const file = Bun.file(this.filePath);
    const text = (await file.exists()) ? await file.text() : "{}";
    const store: Record<string, Snapshot> = {};
    const data = load(text) as Record<string, any>;
    for (const [key, value] of Object.entries(data)) {
      store[key] = {
        command: value.command.join("\n"),
        result: value.result.join("\n"),
        log: value.log.join("\n"),
      };
    }
    this.store = store;
    return store;
  }
}

interface Expectations {
  positive: string[];
  negative: string[];
}

await main();
