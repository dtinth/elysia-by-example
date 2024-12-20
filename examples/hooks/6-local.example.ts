// ### Combined example

import { Elysia } from "elysia";

export default new Elysia()
  .get("/a", () => "a")
  .onBeforeHandle(() => console.log("[interceptor] onBeforeHandle"))
  .get("/b", () => "b", {
    beforeHandle: () => console.log("[local] onBeforeHandle"),
  })
  .get("/c", () => "c")
  .onRequest(() => console.log("[interceptor] onRequest"));

// [prose]
//$ curl -s -D- "$SERVER/a" # GET /a
//$ curl -s -D- "$SERVER/b" # GET /b
//$ curl -s -D- "$SERVER/c" # GET /c
