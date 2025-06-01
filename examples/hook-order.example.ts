import { Elysia } from "elysia";

export default new Elysia()
  .get("/a", () => "a")
  .onBeforeHandle(() => console.log("onBeforeHandle called"))
  .get("/b", () => "b");

// @test a
// @curl -s -D- "$SERVER/a"

// @test b
// @curl -s -D- "$SERVER/b"
