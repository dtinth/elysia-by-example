import { $ } from "bun";
import consola from "consola";
import { isEqual } from "lodash-es";
import pLimit from "p-limit";
import { getRunnableTasks } from "../getRunnableTasks";
import type { RunnableTask } from "../runnableTask";
import type { TaskRunResult } from "../TaskRunResult";

function normalizeTesterOutput(output: string | undefined): string | undefined {
  if (!output) return output;
  return output.replace(
    /Date: [A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT/g,
    "Date: [NORMALIZED]"
  );
}

function normalizeRuntimeLog(logContent: string): string {
  return logContent.replace(/\(node:\d+\)/g, "(node:[PID])");
}

function normalizeSnapshot(snapshot: TaskRunResult): TaskRunResult {
  return {
    ...snapshot,
    // Normalize runtime logs by combining contents into a single string
    runtimeLogs: [
      {
        type: "stdout",
        contents: normalizeRuntimeLog(
          snapshot.runtimeLogs.map((log) => log.contents).join("")
        ),
      },
    ],
    // Normalize tester logs by removing timestamps and date headers
    testerLogs: snapshot.testerLogs.map((log) => ({
      ...log,
      timestamp: new Date(0), // Reset timestamp to epoch
      output: normalizeTesterOutput(log.output),
      error: normalizeTesterOutput(log.error),
    })),
    error: normalizeTesterOutput(snapshot.error),
  };
}

function areSnapshotsEqual(a: TaskRunResult, b: TaskRunResult): boolean {
  return isEqual(normalizeSnapshot(a), normalizeSnapshot(b));
}

async function updateSnapshot(
  task: RunnableTask,
  taskRunResult: TaskRunResult
): Promise<string> {
  const snapshotPath = `snapshots/${task.id}.json`;
  const snapshotContent = JSON.stringify(taskRunResult, null, 2);

  const file = Bun.file(snapshotPath);
  const exists = await file.exists();

  if (exists) {
    const existingContent = await file.text();
    const existingSnapshot: TaskRunResult = JSON.parse(existingContent);
    if (areSnapshotsEqual(existingSnapshot, taskRunResult)) {
      return "unchanged";
    }
  }

  await Bun.write(file, snapshotContent);
  return exists ? "updated" : "created";
}

const runAndUpdate = async (task: RunnableTask) => {
  const taskId = task.id;
  consola.start(`${taskId}`);
  const started = Date.now();
  try {
    const result = await $`bin/run-task ${taskId}`.text();
    const finished = Date.now();

    // Parse TaskRunResult from the output
    const resultMatch = result.match(
      /<task-run-result>\s*([^]*?)\s*<\/task-run-result>/
    );
    if (!resultMatch) {
      consola.error(
        `${taskId} no result found in output`,
        JSON.stringify(result, null, 2)
      );
      throw new Error(`no result found in output`);
    }
    const taskRunResult: TaskRunResult = JSON.parse(resultMatch[1]);
    const snapshotStatus = await updateSnapshot(task, taskRunResult);
    consola.success(
      `${taskId} snapshot ${snapshotStatus}`,
      `(${finished - started}ms)`
    );
  } catch (error) {
    consola.error(`${taskId}`, error);
  }
};

// Get CLI argument for filtering tasks
const filterArg = process.argv[2];

const promises: Promise<void>[] = [];
const limit = pLimit(4);

if (filterArg) {
  consola.info(`Filtering tasks containing: "${filterArg}"`);
}

for await (const task of getRunnableTasks()) {
  // Filter tasks if CLI argument is provided
  if (filterArg && !task.id.includes(filterArg)) {
    continue;
  }
  promises.push(limit(() => runAndUpdate(task)));
}

await Promise.all(promises);
