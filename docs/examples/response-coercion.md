<!-- This file is automatically-generated. Do not edit. -->

<template v-if="false">

> [!CAUTION]
> This file has been automatically generated from the [examples in the `examples/response-coercion` directory.](https://github.com/dtinth/elysia-by-example/tree/main/examples/response-coercion).
> Do not directly edit this file, as it will be overwritten.
> [[View the live site here.]](https://dtinth.github.io/elysia-by-example/examples/response-coercion.html)

</template>


# Response Coercion

If a value returned by the [route handler](https://elysiajs.com/essential/handler.html#response) is not a Response object, Elysia will attempt to coerce it into a Response object.


## JSON

```ts
// examples/response-coercion/json.example.ts
import { Elysia } from "elysia";
export default new Elysia().get("/json", async () => {
  return { ok: true };
});

```


::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/json"
```

</div>

```http
HTTP/1.1 200 OK
Content-Type: application/json;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:45 GMT
Content-Length: 11

{"ok":true}
```
:::

## Plain text

```ts
// examples/response-coercion/text.example.ts
import { Elysia } from "elysia";
export default new Elysia().get("/text", async () => "hi");

```


::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/text"
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:45 GMT
Content-Length: 2

hi
```
:::
