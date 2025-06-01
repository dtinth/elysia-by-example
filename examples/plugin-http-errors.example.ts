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
  }
);

// @test 200
// @curl -s -D- "$SERVER?crash=no"

// @test 418
// @curl -s -D- "$SERVER?crash=418"

// @test 500
// @curl -s -D- "$SERVER?crash=500"
