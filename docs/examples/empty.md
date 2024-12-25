<!-- This file is automatically-generated. Do not edit. -->

<template v-if="false">

> [!CAUTION]
> This file has been automatically generated from the [examples in the `examples/empty` directory.](https://github.com/dtinth/elysia-by-example/tree/main/examples/empty).
> Do not directly edit this file, as it will be overwritten.
> [[View the live site here.]](https://dtinth.github.io/elysia-by-example/examples/empty.html)

</template>


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
Date: Wed, 25 Dec 2024 09:38:45 GMT
Content-Length: 9

NOT_FOUND
```
:::
