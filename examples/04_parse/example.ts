import { defineTest, markdown } from "../../src/docs";
export { default as app } from "./index";

export default markdown`
The context also contains a \`query\` property which is an object containing the query parameters.
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
];
