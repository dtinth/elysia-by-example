export interface TestCommand {
  script: string;
  expectations: Expectation[];
}

interface Expectation {
  type: "positive" | "negative";
  text: string;
}

export function getTestCommands(text: string) {
  const lines = text.split("\n").map((x) => x.trimEnd());
  const parser = new LineBasedParser(lines);
  const source: string[] = [];

  const parseCommand = (): TestCommand | undefined => {
    if (!parser.next?.startsWith("//$")) return;
    const command: string[] = [];
    while (parser.next?.startsWith("//")) {
      const line = parser
        .consume()
        .trim()
        .replace(/^\/\/[$\s]?\s?/, "");
      command.push(line);
      if (!line.endsWith("\\")) break;
    }
    const expectations: Expectation[] = [];
    while (!parser.ended) {
      const line = parser.next.trim();
      if (line.startsWith("//# expect ")) {
        const text = parser.consume().slice("//# expect ".length).trim();
        for (const m of text.matchAll(/"([^"]+)"|(\S+)/g)) {
          expectations.push({ type: "positive", text: m[1] || m[2] });
        }
      } else if (line.startsWith("//# expect-not ")) {
        const text = parser.consume().slice("//# expect-not ".length).trim();
        for (const m of text.matchAll(/"([^"]+)"|(\S+)/g)) {
          expectations.push({ type: "negative", text: m[1] || m[2] });
        }
      } else {
        break;
      }
    }
    return { script: command.join("\n"), expectations };
  };

  const commands: TestCommand[] = [];
  while (!parser.ended) {
    const command = parseCommand();
    if (command) {
      commands.push(command);
    } else {
      source.push(parser.consume());
    }
  }

  return { testCommands: commands, source };
}

class LineBasedParser {
  private index = 0;
  constructor(private lines: string[]) {}
  get next(): string | undefined {
    return this.lines[this.index];
  }
  get ended() {
    return this.index >= this.lines.length;
  }
  consume() {
    return this.lines[this.index++];
  }
}
