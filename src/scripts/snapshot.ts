import consola from "consola";
import { unlinkSync } from "node:fs";
import { join, normalize } from "node:path";
import { run } from "../run";
import { SnapshotManager } from "../SnapshotManager";

const promises: Promise<void>[] = [];

const examplesBasePath = "examples-v2";
const snapshotsBasePath = "snapshots-v2";

interface Task {
  examplePath: string;
  snapshotPath: string;
}

async function* tasks(): AsyncIterable<Task> {
  const glob = new Bun.Glob("**/*.example.ts");
  const exampleFiles = glob.scan(examplesBasePath);
  for await (const match of exampleFiles) {
    const examplePath = join(examplesBasePath, match);
    const snapshotPath = join(
      snapshotsBasePath,
      match.replace(/\.example\.ts$/, ".yml")
    );
    yield { examplePath, snapshotPath };
  }
}

const runAndUpdate = async (task: Task) => {
  const runResult = await run(task.examplePath);

  const snapshots = new SnapshotManager(task.snapshotPath);
  for (const result of runResult.results) {
    const prefix = `${result.testName}:`;
    await snapshots.resolveSnapshot(`${prefix}stdout`, result.stdout);
    for (const [index, command] of result.commands.entries()) {
      const n = index + 1;
      await snapshots.resolveSnapshot(`${prefix}command${n}`, command.script);
      await snapshots.resolveSnapshot(`${prefix}output${n}`, command.output);
    }
  }
  await snapshots.save();
  consola.success(task.examplePath);
};

const targetSnapshotPaths = new Set<string>();

for await (const task of tasks()) {
  targetSnapshotPaths.add(normalize(task.snapshotPath));
  promises.push(runAndUpdate(task));
}

try {
  await Promise.all(promises);

  const snapshotGlob = new Bun.Glob("**/*.snapshot.yml");
  for (const match of snapshotGlob.scanSync(snapshotsBasePath)) {
    const snapshotPath = join(snapshotsBasePath, match);
    if (!targetSnapshotPaths.has(normalize(snapshotPath))) {
      consola.warn("Removing unused snapshot:", snapshotPath);
      unlinkSync(snapshotPath);
    }
  }
} catch (error) {
  process.exitCode = 1;
} finally {
  process.exit();
}
