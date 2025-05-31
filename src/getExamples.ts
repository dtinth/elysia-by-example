import { join } from "node:path";

export interface Example {
  examplePath: string;
}

export async function* getExamples(): AsyncIterable<Example> {
  const examplesBasePath = "examples-v2";
  const glob = new Bun.Glob("**/*.example.ts");
  const exampleFiles = glob.scan(examplesBasePath);
  for await (const match of exampleFiles) {
    const examplePath = join(examplesBasePath, match);
    yield { examplePath };
  }
}
