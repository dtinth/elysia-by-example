import { Elysia } from "elysia";

export default new Elysia()
  .get("/a", () => "a")
  .onBeforeHandle(() => console.log("[interceptor] onBeforeHandle"))
  .get("/b", () => "b", {
    beforeHandle: () => console.log("[local] onBeforeHandle"),
  })
  .get("/c", () => "c")
  .onRequest(() => console.log("[interceptor] onRequest"));

// @test a
// @curl -s -D- "$SERVER/a"

// @test b
// @curl -s -D- "$SERVER/b"

// @test c
// @curl -s -D- "$SERVER/c"
