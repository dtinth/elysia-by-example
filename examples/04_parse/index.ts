import { Elysia } from "elysia";
export default new Elysia().get(
  "/",
  ({ query }) => {
    const name = query["name"] || "world";
    return "hello " + name;
  },
);
