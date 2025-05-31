import { $ } from "bun";
import consola from "consola";
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import pDefer from "p-defer";
import pLimit from "p-limit";
import { getTests, type Test } from "./getTests";

const limiter = pLimit(16);

export async function run(filePath: string) {
  const sourceCode = await Bun.file(filePath).text();
  const { tests, source } = getTests(sourceCode);
  const results = await Promise.all(
    tests.map((test) => limiter(() => runTest(filePath, test)))
  );
  return { source, results };
}

async function runTest(filePath: string, test: Test) {
  const child = spawn(`exec env PORT=0 bun run ${$.escape(filePath)} 2>&1`, {
    shell: true,
    stdio: ["ignore", "pipe", "inherit"],
  });
  child.on("exit", (code) => {
    consola.debug(
      `[${filePath}] process ${child.pid} exited with code ${code}`
    );
  });
  const portDefer = pDefer<number>();
  const finishDefer = pDefer<void>();
  const logReader = async () => {
    let portRead = false;
    const stdout: string[] = [];
    const lineReader = createInterface(child.stdout);
    finishDefer.promise.then(() => lineReader.close());
    await Promise.race([
      (async () => {
        for await (let line of lineReader) {
          if (!portRead) {
            const match = line.match(/:(\d+)/);
            if (match) {
              portDefer.resolve(parseInt(match[1], 10));
              portRead = true;
            }
          }
          stdout.push(line);
        }
      })(),
      finishDefer.promise,
    ]);
    return stdout;
  };
  const logReaderPromise = logReader();
  const port = await portDefer.promise;
  consola.debug(`[${filePath}] running on port ${port}`);
  const runResult: RunResult = {
    actions: [],
    stdout: "",
    testName: test.testName,
  };
  let lastCommandOutput: string | undefined;
  for (const action of test.actions) {
    if (action.type === "command") {
      const rawCmd = action.script;
      const runCmd = rawCmd.replaceAll("$SERVER", `http://localhost:${port}`);
      const showCmd = rawCmd.replaceAll("$SERVER", "http://localhost:3000");
      const result = await $`bash -c ${runCmd} 2>&1`.text();
      lastCommandOutput = result.replaceAll(`:${port}`, ":3000");
      runResult.actions.push({
        type: "command",
        script: showCmd,
        output: lastCommandOutput,
      });
    } else if (action.type === "expect" || action.type === "expect-not") {
      if (lastCommandOutput === undefined) {
        runResult.actions.push({
          type: action.type,
          texts: action.texts,
          output: "Error: expect/expect-not called before a command",
          passed: false,
        });
        continue;
      }
      let allPassed = true;
      for (const text of action.texts) {
        const passed =
          action.type === "expect"
            ? lastCommandOutput.includes(text)
            : !lastCommandOutput.includes(text);
        if (!passed) {
          allPassed = false;
          break;
        }
      }
      runResult.actions.push({
        type: action.type,
        texts: action.texts,
        output: lastCommandOutput,
        passed: allPassed,
      });
    }
  }
  child.kill("SIGINT");
  finishDefer.resolve();
  runResult.stdout = (await logReaderPromise)
    .join("\n")
    .replaceAll(`:${port}`, ":3000");
  return runResult;
}

interface RunResult {
  actions: ActionResult[];
  stdout: string;
  testName: string;
}

interface CommandResult {
  type: "command";
  script: string;
  output: string;
}

interface ExpectResult {
  type: "expect" | "expect-not";
  texts: string[];
  output: string;
  passed: boolean;
}

type ActionResult = CommandResult | ExpectResult;
