import { Elysia } from "elysia";
export default new Elysia()
  .get("/", async () => {
    return "it is working!";
  })
  .get("/greeting", async ({ query }) => {
    const name = query["name"] || "world"; // [!code highlight]
    return `hello ${name}`;
  });

//# test greeting_without_query
//$ curl -s -D- "$SERVER/greeting" # `GET /greeting`
//# expect 200 "hello world"

//# test greeting_with_query
//$ curl -s -D- "$SERVER/greeting?name=alice" # `GET /greeting?name=alice`
//# expect 200 "hello alice"
