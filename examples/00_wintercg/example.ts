import { defineTest, markdown } from "../../src/docs";

export default markdown`
In Bun, you can start a web server without having to explicitly call
the ${"`"}listen${"`"} method — just ${"`"}export default${"`"} an object
that has a ${"`"}fetch${"`"} method.
`;

export const module = await import("./index");
export const tests = [
  defineTest({
    title: "Example request",
    request: (fetch) => fetch("/"),
  }),
];
