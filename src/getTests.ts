export interface Command {
  script: string;
  expectations: Expectation[];
  type: "command"; // Added type for discrimination
}

export interface ExpectCommand {
  type: "expect" | "expect-not";
  texts: string[];
}

export type TestAction = Command | ExpectCommand;

export interface Test {
  testName: string;
  actions: TestAction[]; // Changed from commands: TestCommand[]
}

interface Expectation {
  type: "positive" | "negative";
  text: string;
}

export function getTests(text: string): { tests: Test[]; source: string[] } {
  const lines = text.split("\n").map((x) => x.trimEnd());
  const parser = new LineBasedParser(lines);
  const source: string[] = [];
  const tests: Test[] = [];
  let currentTestName: string | undefined;
  let currentActions: TestAction[] = [];

  const usedTestNames = new Set<string>([]);
  const ensureUnique = (name: string) => {
    let nextSuffix = 2;
    let suffix = "";
    while (usedTestNames.has(name + suffix)) {
      suffix = String(nextSuffix++);
    }
    usedTestNames.add(name + suffix);
    return name + suffix;
  };

  const finalizeCurrentTest = () => {
    if (currentTestName && currentActions.length > 0) {
      tests.push({ testName: currentTestName, actions: currentActions });
    }
    currentActions = [];
  };

  while (!parser.ended) {
    const line = parser.next?.trim();
    if (line?.startsWith("// @test")) {
      finalizeCurrentTest();
      currentTestName = ensureUnique(
        parser.consume().slice("// @test".length).trim() || "test"
      );
    } else if (line?.startsWith("// @curl")) {
      if (!currentTestName) {
        currentTestName = ensureUnique("test");
      }
      const commandLines: string[] = [];
      while (parser.next?.startsWith("// ")) {
        const cmdLine = parser
          .consume()
          .trim()
          .replace(/^\/\/ [@ ]/, "");
        commandLines.push(cmdLine);
        if (!cmdLine.endsWith("\\")) break;
      }
      currentActions.push({
        type: "command",
        script: commandLines.join("\n"),
        expectations: [],
      }); // Expectations will be handled by expect/expect-not
    } else if (
      line?.startsWith("// @expect ") ||
      line?.startsWith("// @expect-not ")
    ) {
      if (!currentTestName) {
        currentTestName = ensureUnique("test");
      }
      const isNegative = line.startsWith("// @expect-not ");
      const textToParse = parser
        .consume()
        .slice(isNegative ? "// @expect-not ".length : "// @expect ".length)
        .trim();
      const texts: string[] = [];
      for (const m of textToParse.matchAll(/"([^"]+)"|(\S+)/g)) {
        texts.push(m[1] || m[2]);
      }
      currentActions.push({
        type: isNegative ? "expect-not" : "expect",
        texts,
      });
    } else {
      source.push(parser.consume());
    }
  }
  finalizeCurrentTest(); // Finalize the last test

  return { tests, source };
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
