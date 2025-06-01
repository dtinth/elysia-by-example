import { Elysia } from "elysia";
export default new Elysia().get("/string", async () => "hi");

//# test
//$ curl -s -D- "$SERVER/string"
