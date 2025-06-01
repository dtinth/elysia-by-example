// ## Available context properties inside each hook
import { Elysia, t } from "elysia";

const logContext = (name: string, context: any) => {
  console.log(
    `[${name}]`.padEnd(17),
    `{ ${Object.keys(context).sort().join(", ")} }`
  );
};

export default new Elysia()
  .onRequest((context) => logContext("onRequest", context))
  .onParse((context) => logContext("onParse", context))
  .onTransform((context) => logContext("onTransform", context))
  .onBeforeHandle((context) => logContext("onBeforeHandle", context))
  .onAfterHandle((context) => logContext("onAfterHandle", context))
  .mapResponse((context) => logContext("mapResponse", context))
  .onAfterResponse((context) => logContext("onAfterResponse", context))
  .onError((context) => logContext("onError", context))
  .post(
    "/",
    async (context) => {
      logContext("handler", context);
      if (context.query["crash"]) throw new Error("crash");
      return { ok: true };
    },
    {
      query: t.Object({
        crash: t.Optional(t.String()),
        validate: t.Optional(t.Literal("pass")),
      }),
    }
  );

// @test 200
// @curl -s -D- $SERVER -X POST -d x=1

// @test 422
// @curl -s -D- "$SERVER?validate=fail" -X POST -d x=1

// @test 500
// @curl -s -D- "$SERVER?crash=1" -X POST -d x=1
