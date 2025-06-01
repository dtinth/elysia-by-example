import type { Example } from "./getExamples";
import type { Test } from "./getTests";

export type Runtime = "node" | "bun";

export interface RunnableTask {
  id: string;
  example: Example;
  test: Test;
  runtime: Runtime;
}
