// ### `additionalProperties` option
// Specify `additionalProperties: true` to allow additional properties in the response object.

import { Elysia, t } from "elysia";
export default new Elysia().get(
  "/",
  async () => {
    return { a: 1, b: 2 };
  },
  { response: t.Object({ a: t.Number() }, { additionalProperties: true }) },
);

// [prose]
//$ curl -s -D- "$SERVER/"
//# expect 200
//# expect "b"
