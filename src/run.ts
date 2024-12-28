import { $ } from "bun";
import consola from "consola";
import { groupBy } from "lodash-es";
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import pDefer from "p-defer";
import pLimit from "p-limit";
import { getTestCommands, type TestCommand } from "./getTestCommands";

const limiter = pLimit(16);

export async function run(filePath: string) {
  const sourceCode = await Bun.file(filePath).text();
  const { testCommands, source } = getTestCommands(sourceCode);
  const results = await Promise.all(
    Object.entries(groupBy(testCommands, (c) => c.testName)).map(
      ([testName, testCommands]) =>
        limiter(() => runTest(filePath, testName, testCommands))
    )
  );
  return { source, results };
}

async function runTest(
  filePath: string,
  testName: string,
  testCommands: TestCommand[]
) {
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
    commands: [],
    stdout: "",
    testName,
  };
  for (const command of testCommands) {
    const rawCmd = command.script;
    const runCmd = rawCmd.replaceAll("$SERVER", `http://localhost:${port}`);
    const showCmd = rawCmd.replaceAll("$SERVER", "http://localhost:3000");
    const result = await $`bash -c ${runCmd} 2>&1`.text();
    runResult.commands.push({
      script: showCmd,
      output: result.replaceAll(`:${port}`, ":3000"),
    });
  }
  child.kill("SIGINT");
  finishDefer.resolve();
  runResult.stdout = (await logReaderPromise)
    .join("\n")
    .replaceAll(`:${port}`, ":3000");
  return runResult;
}

interface RunResult {
  commands: CommandResult[];
  stdout: string;
  testName: string;
}

interface CommandResult {
  script: string;
  output: string;
}
