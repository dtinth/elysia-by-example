// ## Local hooks
// You can also define hooks **directly** on the route.

import { Elysia } from "elysia";

export default new Elysia()
  .get("/a", () => "a", {
    beforeHandle: () => console.log("[local] onBeforeHandle"),
  })
  .get("/b", () => "b");

// [prose]
// Here, a `beforeHandle` hook is defined **locally** on the `/a` route.
//$ curl -s -D- "$SERVER/a"

// ::: tip Types of hook
// We have now seen both types of hooks. Now let’s name these concepts:
//
// - **Local hooks** are hooks defined directly on the route.
// - **Interceptor hooks** are hooks defined on the Elysia instance and applies to routes that come after it.
// :::
