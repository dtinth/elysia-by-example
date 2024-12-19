import { defineTest, markdown } from "../../src/docs";
export { default as app } from "./index";

export default markdown`
You can define routes by calling the \`.get\`, \`.post\`, \`.put\`, \`.patch\`, and \`.delete\` methods on an Elysia app.

It takes 3 arguments:

1. The pathname pattern.
2. The handler function which receives a \`context\` object and returns a response.
3. An optional options object.

The \`context\` object contains many properties. One of which is the original \`request\` object.

When accessing the \`context\` object, it is customary to use destructuring to extract the properties you need.
When you use destructuring, Elysia can statically analyze your function’s argument list to determine which context properties it’s actually using.
This helps Elysia to optimize its performance.
`;

export const tests = [
  defineTest({
    title: "GET / — basic request",
    request: {
      url: "/",
    },
  }),
  defineTest({
    title: "GET /?name=alice — with query parameters",
    request: {
      url: "/?name=alice",
    },
  }),
  defineTest({
    title: "GET /arbitrary-path — arbitrary path",
    request: {
      url: "/arbitrary-path",
    },
    explanation:
      'This time, we only defined a route for "/", so this request returned a 404 response.',
  }),
];
