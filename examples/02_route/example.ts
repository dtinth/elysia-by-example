import { defineTest, markdown } from "../../src/docs";
export { default as app } from "./index";

export default markdown`
You can define routes by calling the \`.get\`, \`.post\`, \`.put\`, \`.patch\`, and \`.delete\` methods on an Elysia app.

It takes 3 arguments:

1. The pathname pattern.
2. The handler function.
3. An optional options object.
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
    title: "GET /arbitrary-path",
    request: {
      url: "/arbitrary-path",
    },
  }),
];
