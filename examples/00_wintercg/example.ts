import { defineTest, markdown } from "../../src/docs";

export default markdown`
In Bun, you can start a web server without having to explicitly call
the \`listen\` method — just \`export default\` an object that has a
\`fetch\` method.

When you run:

~~~sh
bun examples/00_wintercg/index.ts
~~~

You should see:

~~~
Started development server: http://localhost:3000
~~~
`;

export const module = await import("./index");
export const tests = [
  defineTest({
    title: "Example request",
    request: (fetch) => fetch("/"),
  }),
];
