import { Elysia, t } from "elysia";
export default new Elysia().get(
  "/",
  async () => {
    return { a: 1, b: 2 };
  },
  { response: t.Object({ a: t.Number() }, { additionalProperties: true }) }
);

//# test
//$ curl -s -D- "$SERVER/"
//# expect 200
//# expect "b"
