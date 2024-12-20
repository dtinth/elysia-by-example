// ## Plain text

import { Elysia } from "elysia";
export default new Elysia().get("/text", async () => "hi");

// [prose]
//$ curl -s -D- "$SERVER/text"
