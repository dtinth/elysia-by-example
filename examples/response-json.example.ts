import { Elysia } from "elysia";
export default new Elysia().get("/json", async () => {
  return { ok: true };
});

// @test
// @curl -s -D- "$SERVER/json"
