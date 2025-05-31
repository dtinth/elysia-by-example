import { readFile } from "node:fs/promises";
import { getExamples } from "../getExamples";
import { getTests } from "../getTests";

(async () => {
  for await (const example of getExamples()) {
    const content = await readFile(example.examplePath, "utf8");
    const { tests } = getTests(content);
    const testNames = tests.map((t) => t.testName);
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
