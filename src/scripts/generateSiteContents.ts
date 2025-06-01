import consola from "consola";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { getRunnableTasks } from "../getRunnableTasks";
import type { Test } from "../getTests";
import type { TaskRunResult } from "../TaskRunResult";

function cleanExampleCode(content: string): string {
  return content
    .split("\n")
    .filter((line) => {
      const trimmedLine = line.trim();
      // Filter out directive comments that start with //# or //$
      return !trimmedLine.startsWith("//#") && !trimmedLine.startsWith("//$");
    })
    .join("\n");
}

function hasExpectations(test: Test): boolean {
  return test.actions.some(
    (action) => action.type === "expect" || action.type === "expect-not"
  );
}

interface ExampleGroup {
  exampleName: string;
  examplePath: string;
  content: string;
  tests: TestGroup[];
}

interface TestGroup {
  testName: string;
  originalTest: Test;
  runtimes: RuntimeResult[];
}

interface RuntimeResult {
  runtime: string;
  result: TaskRunResult;
}

async function loadSnapshot(taskId: string): Promise<TaskRunResult | null> {
  try {
    const snapshotPath = `snapshots/${taskId}.json`;
    const content = await readFile(snapshotPath, "utf8");
    return JSON.parse(content) as TaskRunResult;
  } catch {
    return null;
  }
}

function formatRuntimeOutput(result: TaskRunResult): string {
  const sections: string[] = [];

  // Add test execution logs
  if (result.testerLogs.length > 0) {
    sections.push("=== Test Execution ===");
    for (const log of result.testerLogs) {
      if (log.type === "command" && log.command) {
        sections.push(`$ ${log.command}`);
        if (log.output) {
          sections.push(log.output);
        }
      } else if (log.type === "expect" || log.type === "expect-not") {
        const status = log.success ? "✓" : "✗";
        sections.push(`${status} ${log.type}: ${log.expectation}`);
      }
    }
    sections.push("");
  }

  // Add runtime logs
  if (result.runtimeLogs.length > 0) {
    sections.push("=== Runtime Output ===");
    for (const log of result.runtimeLogs) {
      sections.push(log.contents);
    }
    sections.push("");
  }

  // Add error if present
  if (result.error) {
    sections.push("=== Error ===");
    sections.push(result.error);
    sections.push("");
  }

  return sections.join("\n");
}

function generateMarkdownPage(exampleGroup: ExampleGroup): string {
  const sections: string[] = [];

  // Title
  sections.push(`# ${exampleGroup.exampleName}`);
  sections.push("");

  // Example code
  sections.push("## Example Code");
  sections.push("");
  sections.push("```typescript");
  sections.push(exampleGroup.content);
  sections.push("```");
  sections.push("");

  // Tests
  sections.push("## Tests");
  sections.push("");

  // Get all unique runtimes
  const allRuntimes = Array.from(
    new Set(
      exampleGroup.tests.flatMap((test) => test.runtimes.map((r) => r.runtime))
    )
  ).sort();

  // Table header
  sections.push("| Test | " + allRuntimes.join(" | ") + " |");
  sections.push("| --- | " + allRuntimes.map(() => "---").join(" | ") + " |");

  // Table rows
  for (const test of exampleGroup.tests) {
    const row = [
      `[${test.testName}](#${test.testName.toLowerCase().replace(/\s+/g, "-")})`,
    ];
    for (const runtime of allRuntimes) {
      const runtimeResult = test.runtimes.find((r) => r.runtime === runtime);
      if (runtimeResult) {
        if (hasExpectations(test.originalTest)) {
          // Test with expectations - use success/fail icons
          const status = runtimeResult.result.success ? "✅" : "❌";
          row.push(status);
        } else {
          // Test without expectations (just execution) - use run icon
          const status = runtimeResult.result.success ? "🏃" : "❌";
          row.push(status);
        }
      } else {
        row.push("N/A");
      }
    }
    sections.push("| " + row.join(" | ") + " |");
  }
  sections.push("");

  for (const test of exampleGroup.tests) {
    sections.push(`### ${test.testName}`);
    sections.push("");

    // Create code group for different runtimes
    sections.push("::: code-group");
    sections.push("");

    for (const runtime of test.runtimes) {
      sections.push(`\`\`\`text [${runtime.runtime}]`);
      sections.push(formatRuntimeOutput(runtime.result));
      sections.push("```");
      sections.push("");
    }

    sections.push(":::");
    sections.push("");
  }

  return sections.join("\n");
}

async function main() {
  consola.start("Generating site contents...");

  // Group tasks by example and test
  const exampleMap = new Map<string, ExampleGroup>();

  for await (const task of getRunnableTasks()) {
    const { example, test, runtime } = task;

    // Load example content if not already loaded
    if (!exampleMap.has(example.exampleName)) {
      const rawContent = await readFile(example.examplePath, "utf8");
      const content = cleanExampleCode(rawContent);
      exampleMap.set(example.exampleName, {
        exampleName: example.exampleName,
        examplePath: example.examplePath,
        content,
        tests: [],
      });
    }

    const exampleGroup = exampleMap.get(example.exampleName)!;

    // Find or create test group
    let testGroup = exampleGroup.tests.find(
      (t) => t.testName === test.testName
    );
    if (!testGroup) {
      testGroup = {
        testName: test.testName,
        originalTest: test,
        runtimes: [],
      };
      exampleGroup.tests.push(testGroup);
    }

    // Load snapshot result
    const result = await loadSnapshot(task.id);
    if (result) {
      testGroup.runtimes.push({
        runtime,
        result,
      });
    } else {
      consola.warn(`No snapshot found for task: ${task.id}`);
    }
  }

  // Generate markdown files
  let generatedCount = 0;
  const exampleNames: string[] = [];

  for (const [exampleName, exampleGroup] of exampleMap) {
    const markdownContent = generateMarkdownPage(exampleGroup);
    const outputPath = join("docs", "examples", `${exampleName}.md`);

    // Ensure directory exists
    await mkdir(dirname(outputPath), { recursive: true });

    // Write file
    await writeFile(outputPath, markdownContent, "utf8");
    consola.success(`Generated: ${outputPath}`);
    generatedCount++;

    // Collect example name for the JSON file
    exampleNames.push(exampleName);
  }

  // Generate examples.json for VitePress config
  const examplesJsonPath = join("docs", ".vitepress", "examples.json");
  await mkdir(dirname(examplesJsonPath), { recursive: true });
  await writeFile(
    examplesJsonPath,
    JSON.stringify({ exampleNames: exampleNames.sort() }, null, 2),
    "utf8"
  );
  consola.success(`Generated: ${examplesJsonPath}`);

  consola.success(
    `Generated ${generatedCount} example pages and examples.json`
  );
}

if (import.meta.main) {
  main().catch(consola.error);
}
