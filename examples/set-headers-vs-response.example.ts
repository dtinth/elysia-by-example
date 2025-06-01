import { Elysia } from "elysia";
export default new Elysia().get("/", async ({ set }) => {
  set.headers["x-foo"] = "bar";
  return new Response("hi", {
    headers: {
      "x-foo": "baz",
    },
  });
});

// @test
// @curl -s -D- "$SERVER"
