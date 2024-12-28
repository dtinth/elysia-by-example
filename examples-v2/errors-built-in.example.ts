import { Elysia, InternalServerError, t } from "elysia";
export default new Elysia()
  .onError(({ error, code }) => {
    console.log("[onError]", { error, code });
  })
  .get("/crash/internal", async () => {
    throw new InternalServerError("Something went wrong!");
  })
  .get("/crash/error", async () => {
    throw new Error("Something went wrong!");
  })
  .post("/body", async ({ body }) => ({ body }))
  .get("/validate", async () => "Validation passed", {
    query: t.Object({ name: t.String() }),
  })
  .get("/cookie", async ({ cookie }) => cookie.name.value, {
    cookie: t.Cookie(
      { name: t.String() },
      { secrets: "something", sign: ["name"] }
    ),
  });

//# test 404
//$ curl -s -D- $SERVER/nonexistent # `GET /nonexistent`
//# expect 404
//# expect-not 200

//# test parse_error
//$ curl -s -D- $SERVER/body -X POST -H "Content-Type: application/json" -d '{' # `POST /body`

//# test validation_error
//$ curl -s -D- $SERVER/validate # `GET /validate`

//# test invalid_cookie_signature
//$ curl -s -D- $SERVER/cookie -H "Cookie: name=unsigned" # `GET /cookie`

//# test internal_server_error
//$ curl -s -D- $SERVER/crash/internal # `GET /crash/internal`

//# test generic_error
//$ curl -s -D- $SERVER/crash/error # `GET /crash/error`
