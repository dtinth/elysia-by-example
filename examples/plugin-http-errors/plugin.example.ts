// # http-errors integration
// This plugin lets you:
//
// - Throw an instance of HttpError from the `http-errors` package and have it properly formatted as a JSON response.
// - Use a model `error` to define the shape of the error response.
//
import Elysia, { t } from "elysia";
import createHttpError from "http-errors";

const httpErrorsPlugin = new Elysia({ name: "http-errors" })
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
  .as("plugin");

export default new Elysia().use(httpErrorsPlugin).get(
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
