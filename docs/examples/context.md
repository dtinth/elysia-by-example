<!-- This file is automatically-generated. Do not edit. -->

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
Date: Fri, 20 Dec 2024 12:20:33 GMT
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
  set: {
    headers: {},
    status: 200,
    cookie: {},
  },
  error: [Function: error],
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
