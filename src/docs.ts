export const markdown = (strings: TemplateStringsArray, ...values: any[]) => {
  return strings.reduce((acc, string, i) => {
    return acc + string + (values[i] || "");
  }, "");
};

export interface TestRequest {
  url: string;
}

export interface Test {
  title: string;
  request: TestRequest;
}

export function defineTest(test: Test) {
  return test;
}

export const code = (x: string) => "`" + x + "`";
