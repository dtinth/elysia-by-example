// ## Letting Elysia parse the query string
// Elysia also provides the `query` property on the `context` object, which is an object containing the query parameters.
import { Elysia } from "elysia";
export default new Elysia()
  .get("/", async () => {
    return "it is working!";
  })
  .get("/greeting", async ({ query }) => {
    const name = query["name"] || "world"; // [!code highlight]
    return `hello ${name}`;
  });

// [prose]
//$ curl -s -D- "$SERVER/greeting" # `GET /greeting`
//$ curl -s -D- "$SERVER/greeting?name=alice" # `GET /greeting?name=alice`
