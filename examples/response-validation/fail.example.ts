// ## Failed validations result in 422
// The response validation will fail if the response does not match the schema.
// When this happens, Elysia will return a 422 Unprocessable Entity response.
// The `onError` hook will be called with the error code of `VALIDATION`.

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
    { response: t.Object({ a: t.Number() }) },
  );

// [prose]
//$ curl -s -D- "$SERVER/"
//# expect 422
