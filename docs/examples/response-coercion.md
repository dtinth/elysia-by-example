<!-- This file is automatically-generated. Do not edit. -->

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
Date: Fri, 20 Dec 2024 12:20:33 GMT
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
Date: Fri, 20 Dec 2024 12:20:33 GMT
Content-Length: 2

hi
```
:::
