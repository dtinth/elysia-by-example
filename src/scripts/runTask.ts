import { consola } from "consola";
import { getRunnableTasks } from "../getRunnableTasks";
import type { RunnableTask } from "../runnableTask";
import { Runtime } from "../Runtime";
import { Tester, type ActionLogEntry } from "../Tester";

interface TaskRunResult {
  taskId: string;
  success: boolean;
  runtimeLogs: Array<{
    type: "stderr" | "stdout";
    contents: string;
  }>;
  testerLogs: ActionLogEntry[];
  error?: string;
}

async function findTaskById(taskId: string): Promise<RunnableTask | null> {
  for await (const task of getRunnableTasks()) {
    if (task.id === taskId) {
      return task;
    }
  }
  return null;
}

async function runTask(task: RunnableTask): Promise<void> {
  consola.info(`Running task: ${task.id}`);
  consola.info(`Example: ${task.example.examplePath}`);
  consola.info(`Test: ${task.test.testName}`);
  consola.info(`Runtime: ${task.runtime}`);

  const result: TaskRunResult = {
    taskId: task.id,
    success: false,
    runtimeLogs: [],
    testerLogs: [],
  };

  // 1. Create and start the runtime
  const runtime = new Runtime(task.example.examplePath, task.runtime);
  // 2. Create tester
  const tester = new Tester();

  try {
    await runtime.start();

    // Execute test actions
    await tester.executeTestActions(task.test.actions);

    // If we reach here, all actions succeeded
    result.success = true;
    consola.success("All test actions completed successfully!");
  } catch (error) {
    result.success = false;
    result.error = error instanceof Error ? error.message : String(error);
    throw error;
  } finally {
    // Always collect logs and stop runtime
    result.runtimeLogs = runtime.getLogs();
    result.testerLogs = tester.getActionLog();

    await runtime.stop();

    // Output the result as JSON wrapped in tags
    console.log(`<task-run-result>`);
    console.log(JSON.stringify(result, null, 2));
    console.log(`</task-run-result>`);
    process.exit(0);
  }
}

async function main() {
  const taskId = process.argv[2];

  if (!taskId) {
    consola.error("Usage: bun run src/scripts/runTask.ts <task-id>");
    process.exit(1);
  }

  consola.info(`Looking for task: ${taskId}`);

  const task = await findTaskById(taskId);

  if (!task) {
    consola.error(`Task not found: ${taskId}`);
    process.exit(1);
  }

  try {
    await runTask(task);
    consola.success("Task completed successfully");
  } catch (error) {
    consola.error("Task failed:", error);
    process.exit(1);
  }
}

if (import.meta.main) {
  main().catch(consola.error);
}
