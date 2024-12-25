// ## Providing a standard error model
// Combine `model`, `onError`, and a custom error handler to provide a standard error model.

import Elysia, { t } from "elysia";
import createHttpError from "http-errors";

export default new Elysia()
  .model({
    error: t.Object({
      error: t.Object({ message: t.String() }),
    }),
  })
  .onError(({ error, set }) => {
    if (createHttpError.isHttpError(error)) {
      set.status = error.status;
      return {
        error: {
          message: error.expose ? error.message : "Something went wrong...",
        },
      };
    }
  })
  .get(
    "/",
    async ({ query: { crash } }) => {
      if (crash === "418") {
        throw createHttpError.ImATeapot("meow");
      }
      if (crash === "500") {
        throw createHttpError.InternalServerError("woof");
      }
      return { ok: true };
    },
    {
      query: t.Object({ crash: t.String() }),
      response: {
        200: t.Object({ ok: t.Literal(true) }),
        418: "error",
        500: "error",
      },
    },
  );

// [prose]
//$ curl -s -D- "$SERVER?crash=no" # A successful request
//$ curl -s -D- "$SERVER?crash=418" # A failing request - 418
//$ curl -s -D- "$SERVER?crash=500" # A failing request - 500
