// ## Built-in Errors
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
      { secrets: "something", sign: ["name"] },
    ),
  });

// [prose]
// ### Not found
// This happens when the requested path does not match any route.
//
// - Status: 404 Not Found
// - Error class: `NotFoundError`
// - Code: `NOT_FOUND`
//$ curl -s -D- $SERVER/nonexistent # `GET /nonexistent`
//# expect 404
//# expect-not 200

// ### Body parsing error
// This happens when the request body cannot be parsed.
//
// - Status: 400 Bad Request
// - Error class: `ParseError`
// - Code: `PARSE`
//$ curl -s -D- $SERVER/body -X POST -H "Content-Type: application/json" -d '{' # `POST /body`

// ### Validation error
// This happens when the request can be parsed, but does not match the schema.
// It also happens when you specify a response schema and the response from your application does not match it.
//
// - Status: 422 Unprocessable Entity
// - Error class: `ValidationError`
// - Code: `VALIDATION`
//$ curl -s -D- $SERVER/validate # `GET /validate`

// ### Validation error
// This happens when the request can be parsed, but does not match the schema.
// It also happens when you specify a response schema and the response from your application does not match it.
//
// - Status: 422 Unprocessable Entity
// - Error class: `ValidationError`
// - Code: `VALIDATION`
//$ curl -s -D- $SERVER/cookie -H "Cookie: name=unsigned" # `GET /cookie`

// ### Internal server error
// This happens when your application code explicitly throws a new `InternalServerError`.
//
// - Status: 422 Unprocessable Entity
// - Error class: `ValidationError`
// - Code: `VALIDATION`
//$ curl -s -D- $SERVER/crash/internal # `GET /crash/internal`

// ### Unknown error
// This happens when your application code throws an error that is not any of the built-in Elysia errors.
//
// - Status: 500 Internal Server Error
// - Code: `UNKNOWN`
//$ curl -s -D- $SERVER/crash/error # `GET /crash/error`
