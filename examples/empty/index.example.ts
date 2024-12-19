// # The Smallest Server
// When you create an Elysia instance, it contains a `fetch` method.
// As covered in the [intro](./intro.html), you can `export default` this instance and run it with Bun.
import { Elysia } from "elysia";
export default new Elysia();

// [prose]
// Since this app has no routes, it will return a 404 response for any request.
//$ curl -s -D- $SERVER
