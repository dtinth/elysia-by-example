import { Elysia } from "elysia";
export default new Elysia().get("/", async ({ set }) => {
  set.status = "Conflict";
  return new Response("hi", { status: 402 });
});

//# test
//$ curl -s -D- "$SERVER"
