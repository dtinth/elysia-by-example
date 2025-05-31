import { join } from "node:path";

export interface Task {
  examplePath: string;
  snapshotPath: string;
}

export async function* getTasks(): AsyncIterable<Task> {
  const examplesBasePath = "examples-v2";
  const snapshotsBasePath = "snapshots-v2";
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
