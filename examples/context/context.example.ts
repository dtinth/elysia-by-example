// # Context
//
// ::: warning Not idiomatic
// This example is just to show what the context object looks like.
// It is not idiomatic Elysia code — you should not use the context object directly in your code, but instead destructure it to extract the properties you need.
// :::

import { Elysia } from "elysia";
export default new Elysia().get("/context", async (context) => {
  return Bun.inspect(context);
});

// [prose]
//$ curl -s -D- "$SERVER/context"
