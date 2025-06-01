import { Elysia } from "elysia";

export default new Elysia()
  .get("/a", () => "a", {
    beforeHandle: () => console.log("[local] onBeforeHandle called"),
  })
  .get("/b", () => "b");

// @test
// @curl -s -D- "$SERVER/a"
