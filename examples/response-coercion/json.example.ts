// ## JSON

import { Elysia } from "elysia";
export default new Elysia().get("/json", async () => {
  return { ok: true };
});

// [prose]
//$ curl -s -D- "$SERVER/json"
