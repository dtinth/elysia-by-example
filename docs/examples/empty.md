<!-- This file is automatically-generated. Do not edit. -->

# The Smallest Server
When you create an Elysia instance, it contains a `fetch` method.
As covered in the [intro](./intro.html), you can `export default` this instance and run it with Bun.
```ts
// examples/empty/index.example.ts
import { Elysia } from "elysia";
export default new Elysia();

```

Since this app has no routes, it will return a 404 response for any request.

::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- http://localhost:3000
```

</div>

```http
HTTP/1.1 404 Not Found
content-type: text/plain;charset=utf-8
Date: Fri, 20 Dec 2024 12:20:33 GMT
Content-Length: 9

NOT_FOUND
```
:::
