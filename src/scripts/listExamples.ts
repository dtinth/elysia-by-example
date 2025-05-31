import { getExamples } from "../getTasks";

(async () => {
  for await (const example of getExamples()) {
    console.log(
      `Example: ${example.examplePath} -> Snapshot: ${example.snapshotPath}`
    );
  }
})();
