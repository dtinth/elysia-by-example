import { getExamples } from "../getExamples";

(async () => {
  for await (const example of getExamples()) {
    console.log(
      `Example: ${example.examplePath} -> Snapshot: ${example.snapshotPath}`
    );
  }
})();
