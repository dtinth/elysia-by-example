// ## Error handling in validation schema
// A schema can define an error message which will be sent to the client if the validation fails on that key.

import Elysia, { t } from "elysia";

export default new Elysia().post("/", () => "Hello World!", {
  body: t.Object({ x: t.Number({ error: "x must be a number" }) }),
});

// [prose]
//$ curl -s -D- -X POST "$SERVER" -H "Content-Type: application/json" -d '{"x": 1}' # A successful request
//$ curl -s -D- -X POST "$SERVER" -H "Content-Type: application/json" -d '{"x": "wat"}' # A failing request with wrong inner type
//$ curl -s -D- -X POST "$SERVER" -H "Content-Type: application/json" -d '42' # A failing request with wrong outer type
