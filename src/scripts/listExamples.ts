import { readFile } from "node:fs/promises";
import { getExamples } from "../getExamples";
import { getTestCommands } from "../getTestCommands";

(async () => {
  for await (const example of getExamples()) {
    const content = await readFile(example.examplePath, "utf8");
    const { testCommands } = getTestCommands(content);
    const testNames = testCommands.map((tc) => tc.testName);
    console.log(`Example: ${example.examplePath}`);
    if (testNames.length > 0) {
      for (const name of testNames) {
        console.log(`  - ${name}`);
      }
    } else {
      console.log("  (no test cases)");
    }
  }
})();
