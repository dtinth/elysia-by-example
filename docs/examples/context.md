<!-- This file is automatically-generated. Do not edit. -->

<template v-if="false">

> [!CAUTION]
> This file has been automatically generated from the [examples in the `examples/context` directory.](https://github.com/dtinth/elysia-by-example/tree/main/examples/context).
> Do not directly edit this file, as it will be overwritten.
> [[View the live site here.]](https://dtinth.github.io/elysia-by-example/examples/context.html)

</template>


# Context

::: warning Not idiomatic
This example is just to show what the context object looks like.
It is not idiomatic Elysia code — you should not use the context object directly in your code, but instead destructure it to extract the properties you need.
:::

```ts
// examples/context/context.example.ts
import { Elysia } from "elysia";
export default new Elysia().get("/context", async (context) => {
  return Bun.inspect(context);
});

```


::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/context"
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Mon, 23 Dec 2024 18:42:46 GMT
Content-Length: 593

{
  request: Request (0 KB) {
    method: "GET",
    url: "http://localhost:3000/context",
    headers: Headers {
      "host": "localhost:3000",
      "user-agent": "curl/8.7.1",
      "accept": "*/*",
    }
  },
  store: {},
  qi: -1,
  path: "/context",
  url: "http://localhost:3000/context",
  redirect: [Function: redirect],
  error: [Function: error],
  set: {
    headers: {},
    status: 200,
    cookie: {},
  },
  server: [Getter],
  headers: {
    host: "localhost:3000",
    "user-agent": "curl/8.7.1",
    accept: "*/*",
  },
  cookie: {},
  query: {},
  route: "/context",
}
```
:::
