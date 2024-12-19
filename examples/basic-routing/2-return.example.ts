// ## Returning non-Response values
// If your route handler returns a value that is not a `Response` object, Elysia will convert it to a `Response` object for you.
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

// [prose]
// By default, if your route handler returns a `string`, it will be converted to a `Response` object with the `content-type` header set to `text/plain;charset=utf-8`.
//$ curl -s -D- "$SERVER" # `GET /`
