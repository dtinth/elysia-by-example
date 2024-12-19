import { Elysia } from "elysia";
export default new Elysia().get(
  "/",
  ({ request }) => {
    const url = new URL(request.url);
    const name =
      url.searchParams.get("name") || "world";
    return "hello " + name;
  },
);
