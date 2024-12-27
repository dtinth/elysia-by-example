import consola from "consola";
import { run } from "../run";
import { SnapshotManager } from "../SnapshotManager";

const glob = new Bun.Glob("examples/**/*.example.ts");
const promises: Promise<void>[] = [];

interface Task {
  examplePath: string;
  snapshotPath: string;
}

async function* tasks(
  exmapleFiles: AsyncIterable<string>
): AsyncIterable<Task> {
  for await (const examplePath of exmapleFiles) {
    const snapshotPath = examplePath
      .replace(/^examples/, "snapshots-v2")
      .replace(/\.ts$/, ".snapshot.yml");
    yield { examplePath, snapshotPath };
  }
}

const runAndUpdate = async (task: Task) => {
  const runResult = await run(task.examplePath);

  const snapshots = new SnapshotManager(task.snapshotPath);
  let nextIndex = 1;
  for (const result of runResult.results) {
    const id = `test${nextIndex++}`;
    await snapshots.resolveSnapshot(`${id}_stdout`, result.stdout);
    for (const command of result.commands) {
      await snapshots.resolveSnapshot(`${id}_command`, command.script);
      await snapshots.resolveSnapshot(`${id}_output`, command.output);
    }
  }
  await snapshots.save();
  consola.success(task.examplePath);
};

for await (const task of tasks(glob.scan())) {
  promises.push(runAndUpdate(task));
}

try {
  await Promise.all(promises);
} catch (error) {
  process.exitCode = 1;
} finally {
  process.exit();
}
