import { join } from "node:path";

export interface Example {
  examplePath: string;
  exampleName: string;
}

export async function* getExamples(): AsyncIterable<Example> {
  const examplesBasePath = "examples";
  const glob = new Bun.Glob("**/*.example.ts");
  const exampleFiles = glob.scan(examplesBasePath);
  for await (const match of exampleFiles) {
    const examplePath = join(examplesBasePath, match);
    const exampleName = match.replace(".example.ts", "");
    yield { examplePath, exampleName };
  }
}
