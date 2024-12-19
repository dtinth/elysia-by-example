import { defineTest, markdown } from "../../src/docs";
export { default as app } from "./index";

export default markdown`
In Elysia, when you return a non-Response object from a route handler,
Elysia will convert it to a Response object for you.

For example, a string will be converted to a \`text/plain\` response.
`;

export const tests = [
  defineTest({
    title: "GET / — basic request",
    request: {
      url: "/",
    },
  }),
];
