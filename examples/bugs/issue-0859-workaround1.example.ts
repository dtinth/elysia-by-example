// ### Workaround: Specify `additionalProperties: true` in the top level response schema
// It appears that `additionalProperties` has to be specified at the top level, and then it is applied throughout the entire schema.

import Elysia, { t } from "elysia";
export default new Elysia().get(
  "/",
  async () => {
    return { keys: [{ a: 1, b: 2 }], extra: true };
  },
  {
    response: t.Object(
      { keys: t.Array(t.Object({ a: t.Number() })) },
      { additionalProperties: true },
    ),
  },
);

// [prose]
// This somewhat solves the problem in that the `b` property is now **present** in the response object.
// But we also get the `extra` property, which we did not expect.
//$ curl -s -D- "$SERVER" # `GET /`
// Furthermore, we are breaking away from the JSON Schema specification.
// According to the specification, the nested object should not have the `b` property, yet it is still returned in the response.
// This could become problematic when integrating with other systems that rely on the JSON Schema specification.
