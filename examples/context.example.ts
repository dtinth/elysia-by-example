import { Elysia } from "elysia";
export default new Elysia().get("/context", async (context) => {
  return Bun.inspect(context);
});

// @test
// @curl -s -D- "$SERVER/context"
