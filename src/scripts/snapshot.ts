import { $ } from "bun";
import consola from "consola";
import pLimit from "p-limit";
import { getRunnableTasks } from "../getRunnableTasks";
import type { RunnableTask } from "../runnableTask";
import type { TaskRunResult } from "../TaskRunResult";

async function updateSnapshot(
  task: RunnableTask,
  taskRunResult: TaskRunResult
): Promise<string> {
  const snapshotPath = `snapshots-v2/${task.id}.json`;
  const snapshotContent = JSON.stringify(taskRunResult, null, 2);

  const file = Bun.file(snapshotPath);
  const exists = await file.exists();

  if (exists) {
    const existingContent = await file.text();
    if (existingContent === snapshotContent) {
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

const promises: Promise<void>[] = [];
const limit = pLimit(4);

for await (const task of getRunnableTasks()) {
  promises.push(limit(() => runAndUpdate(task)));
}

await Promise.all(promises);
