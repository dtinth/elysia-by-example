import { defineTest, markdown } from "../../src/docs";
export { default as app } from "./index";

export default markdown`
In Bun, you can start a web server without having to explicitly call
the \`listen\` method — just \`export default\` an object that has a
\`fetch\` method. It should:

1. Accept a \`Request\` object.
2. Return a \`Response\` object.

When you run:

~~~sh
bun examples/00_wintercg/index.ts
~~~

You should see:

~~~
Started development server: http://localhost:3000
~~~

- You can configure the listening port by setting the \`PORT\` environment variable.
- If you set \`NODE_ENV=production\`, it will say “Started server” instead of “Started development server”.
`;

export const tests = [
  defineTest({
    title: "GET /",
    request: {
      url: "/",
    },
  }),
  defineTest({
    title: "GET /?name=alice",
    request: {
      url: "/?name=alice",
    },
  }),
  defineTest({
    title: "GET /arbitrary-path?name=bob",
    description:
      'The fetch handler is called for every request, so paths like "/arbitrary-path" work too.',
    request: {
      url: "/arbitrary-path?name=bob",
    },
  }),
];
