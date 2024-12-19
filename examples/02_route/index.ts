import { Elysia } from "elysia";
export default new Elysia().get(
  // Pathname
  "/",

  // Handler
  ({ request }) => {
    const url = new URL(request.url);
    const name =
      url.searchParams.get("name") || "world";
    return new Response("hello " + name, {
      status: 200,
    });
  },

  // No options for now...
);
