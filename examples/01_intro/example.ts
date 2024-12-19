import { defineTest, markdown } from "../../src/docs";
export { default as app } from "./index";

export default markdown`
Elysia implements such an interface.
That means you can \`export default\` an Elysia app and it will start a server when run with Bun.

Right now, the server does not have any routes, so it will return a 404 response for any request.
`;

export const tests = [
  defineTest({
    title: "Example request",
    request: {
      url: "/",
    },
  }),
];
