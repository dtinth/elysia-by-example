// ## Available context properties inside each hook
import { Elysia } from "elysia";

const logContext = (name: string, context: any) => {
  console.log(
    `[${name}]`.padEnd(17),
    `{ ${Object.keys(context).sort().join(", ")} }`,
  );
};

// XXX: Temporarily enable `aot: false` to work around a bug introduced in Elysia v1.2.2
// See: https://github.com/elysiajs/elysia/issues/965
export default new Elysia({ aot: false })
  .onRequest((context) => logContext("onRequest", context))
  .onParse((context) => logContext("onParse", context))
  .onTransform((context) => logContext("onTransform", context))
  .onBeforeHandle((context) => logContext("onBeforeHandle", context))
  .onAfterHandle((context) => logContext("onAfterHandle", context))
  .mapResponse((context) => {
    logContext("mapResponse", context);
    return context.response;
  })
  .onAfterResponse((context) => logContext("onAfterResponse", context))
  .onError((context) => logContext("onError", context))
  .post("/", async (context) => {
    logContext("handler", context);
    if (context.query["crash"]) throw new Error("crash");
    return "ok";
  });

// [prose]
//$ curl -s -D- $SERVER -X POST -d x=1 # A successful request
//$ curl -s -D- "$SERVER?crash=1" -X POST -d x=1 # A crashing request
