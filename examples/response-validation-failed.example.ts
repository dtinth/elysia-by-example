import { Elysia, t } from "elysia";
export default new Elysia()
  .onError(({ code }) => {
    console.log("[onError]", code);
  })
  .get(
    "/",
    async () => {
      return { a: "x" as any };
    },
    { response: t.Object({ a: t.Number() }) }
  );

// @test
// @curl -s -D- "$SERVER/"
// @expect 422
