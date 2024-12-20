// ## Most hooks are route-specific
// It can be useful to think of hooks as if **each route has its own set of hooks**.
// When you declare a hook, it only affects the routes declared after it.
import { Elysia } from "elysia";

export default new Elysia()
  .get("/a", () => "a")
  .onBeforeHandle(() => console.log("onBeforeHandle"))
  .get("/b", () => "b");

// [prose]
// In this example, the `onBeforeHandle` hook only applies to the `/b` route.

// When you make a request to `/a`, you will not see the log message.
//$ curl -s -D- "$SERVER/a" # GET /a

// But when you make a request to `/b`, you will see the log message.
//$ curl -s -D- "$SERVER/b" # GET /b

// ::: tip Mental model
//
// I like to think of Elysia as a route generator that maintains a current list of hooks that should be applied to future routes.
//
// - When you declare a hook, it's added to this list.
// - When you declare a route, the current list of hooks (at that point in time) is copied into that route.
//
// This explains how:
//
// - Hooks only affect routes declared after them
// - Each route has its own set of hooks
//
// This mental model will become especially useful when we later incorporate
// _local hooks_ and _plugins_ into the picture.
// :::
