import { getRunnableTasks } from "../getRunnableTasks";

(async () => {
  for await (const task of getRunnableTasks()) {
    console.log(`Task ID: ${task.id}`);
    console.log(`  Example: ${task.example.examplePath}`);
    console.log(`  Test: ${task.test.testName}`);
    console.log(`  Runtime: ${task.runtime}`);
  }
})();
