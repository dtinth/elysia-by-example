// # afterResponse

import { Elysia } from "elysia";
export default new Elysia()
  .onAfterResponse(({ response }) => {
    console.log("Response:", response);
  })
  .get("/", async () => {
    return { ok: true };
  });

// [prose]
//$ curl -s -D- "$SERVER"
