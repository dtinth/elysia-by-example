// ## additionalProperties do not work in nested response objects ([#859](https://github.com/elysiajs/elysia/issues/859))

import Elysia, { t } from "elysia";
export default new Elysia().get(
  "/",
  async () => {
    return { keys: [{ a: 1, b: 2 }], extra: true };
  },
  {
    response: t.Object({
      keys: t.Array(
        t.Object({ a: t.Number() }, { additionalProperties: true }),
      ),
    }),
  },
);

// [prose]
// In this example, the `b` property is **missing** from the response object, even though `additionalProperties` is set to `true` in the nested object schema.
//$ curl -s -D- "$SERVER" # `GET /`
