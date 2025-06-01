import { readFile } from "node:fs/promises";
import { getExamples } from "./getExamples";
import { getTests } from "./getTests";
import type { RunnableTask, Runtime } from "./runnableTask";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export async function* getRunnableTasks(): AsyncIterable<RunnableTask> {
  for await (const example of getExamples()) {
    const content = await readFile(example.examplePath, "utf8");
    const { tests } = getTests(content);
    for (const test of tests) {
      const runtimes: Runtime[] = ["bun", "node"];
      for (const runtime of runtimes) {
        const slugifiedExampleName = slugify(example.exampleName);
        const slugifiedTestName = slugify(test.testName);
        yield {
          id: `${slugifiedExampleName}__${slugifiedTestName}__${runtime}`,
          example,
          test,
          runtime,
        };
      }
    }
  }
}
