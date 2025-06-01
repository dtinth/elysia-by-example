import { Elysia, t } from "elysia";
export default new Elysia().get(
  "/",
  async () => {
    return { a: 1, b: 2 };
  },
  { response: t.Object({ a: t.Number() }) }
);

// @test
// @curl -s -D- "$SERVER/"
// @expect 200
// @expect-not "b"
