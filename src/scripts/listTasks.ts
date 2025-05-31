import { getTasks } from "../getTasks";

(async () => {
  for await (const task of getTasks()) {
    console.log(
      `Example: ${task.examplePath} -> Snapshot: ${task.snapshotPath}`
    );
  }
})();
