// ## `onRequest` hook is not route-specific
// The `onRequest` hook is an exception to the rule, because `onRequest` is called **outside** the router (i.e. it is called even before the router sees the request).
import { Elysia } from "elysia";

export default new Elysia()
  .get("/a", () => "a")
  .onRequest(() => console.log("onRequest"))
  .get("/b", () => "b");

// [prose]
// In this example, the `onRequest` hook applies to both routes.

// When you make a request to `/a`, you will not see the log message.
//$ curl -s -D- "$SERVER/a" # GET /a

// But when you make a request to `/b`, you will see the log message.
//$ curl -s -D- "$SERVER/b" # GET /b
