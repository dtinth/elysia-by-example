import Elysia, { t } from "elysia";
export default new Elysia().get(
  "/",
  async () => {
    // Bug: `b: 2` should not be included in the response object, yet it is.
    return { keys: [{ a: 1, b: 2 }], extra: true };
  },
  {
    response: t.Object(
      { keys: t.Array(t.Object({ a: t.Number() })) },
      { additionalProperties: true }
    ),
  }
);

//# test
//$ curl -s -D- "$SERVER" # `GET /`
