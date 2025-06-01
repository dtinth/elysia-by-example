import { Elysia } from "elysia";
export default new Elysia()
  .get("/", async ({ request }) => {
    return "it is working!"; // [!code highlight]
  })
  .get("/greeting", async ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get("name") || "world";
    return `hello ${name}`; // [!code highlight]
  });

//# test root
//$ curl -s -D- "$SERVER" # `GET /`
//# expect 200 "it is working!"

//# test greeting_without_query
//$ curl -s -D- "$SERVER/greeting" # `GET /greeting`
//# expect 200 "hello world"

//# test greeting_with_query
//$ curl -s -D- "$SERVER/greeting?name=alice" # `GET /greeting?name=alice`
//# expect 200 "hello alice"
