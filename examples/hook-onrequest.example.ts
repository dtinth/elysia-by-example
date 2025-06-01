import { Elysia } from "elysia";

export default new Elysia()
  .get("/a", () => "a")
  .onRequest(() => console.log("onRequest"))
  .get("/b", () => "b");

// @test a
// @curl -s -D- "$SERVER/a"

// @test b
// @curl -s -D- "$SERVER/b"
