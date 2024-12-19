export const markdown = String.raw;

export interface Test {
  title: string;
  request: (fetch: Fetch) => Promise<Response>;
}

export function defineTest(test: Test) {
  return test;
}

export const code = (x: string) => "`" + x + "`";
