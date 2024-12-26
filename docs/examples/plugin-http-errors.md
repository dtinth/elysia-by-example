<!-- This file is automatically-generated. Do not edit. -->

<template v-if="false">

> [!CAUTION]
> This file has been automatically generated from the [examples in the `examples/plugin-http-errors` directory.](https://github.com/dtinth/elysia-by-example/tree/main/examples/plugin-http-errors).
> Do not directly edit this file, as it will be overwritten.
> [[View the live site here.]](https://dtinth.github.io/elysia-by-example/examples/plugin-http-errors.html)

</template>


# http-errors integration
This plugin lets you:

- Throw an instance of HttpError from the `http-errors` package and have it properly formatted as a JSON response.
- Use a model `error` to define the shape of the error response.

```ts
// examples/plugin-http-errors/plugin.example.ts
import Elysia, { t } from "elysia";
import createHttpError from "http-errors";

const httpErrorsPlugin = new Elysia({ name: "http-errors" })
  .model({
    error: t.Object({
      error: t.Object({ message: t.String() }),
    }),
  })
  .onError(({ error, set }) => {
    if (createHttpError.isHttpError(error)) {
      set.status = error.status;
      return {
        error: {
          message: error.expose ? error.message : "Something went wrong...",
        },
      };
    }
  })
  .as("plugin");

export default new Elysia().use(httpErrorsPlugin).get(
  "/",
  async ({ query: { crash } }) => {
    if (crash === "418") {
      throw createHttpError.ImATeapot("meow");
    }
    if (crash === "500") {
      throw createHttpError.InternalServerError("woof");
    }
    return { ok: true };
  },
  {
    query: t.Object({ crash: t.String() }),
    response: {
      200: t.Object({ ok: t.Literal(true) }),
      418: "error",
      500: "error",
    },
  },
);

```


::: details Example request: A successful request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000?crash=no" 
```

</div>

```http
HTTP/1.1 200 OK
Content-Type: application/json;charset=utf-8
Date: Wed, 25 Dec 2024 21:59:48 GMT
Content-Length: 11

{"ok":true}
```
:::


::: details Example request: A failing request - 418

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000?crash=418" 
```

</div>

```http
HTTP/1.1 418 I'm a Teapot
Content-Type: application/json;charset=utf-8
Date: Wed, 25 Dec 2024 21:59:48 GMT
Content-Length: 28

{"error":{"message":"meow"}}
```
:::


::: details Example request: A failing request - 500

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000?crash=500" 
```

</div>

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=utf-8
Date: Wed, 25 Dec 2024 21:59:48 GMT
Content-Length: 47

{"error":{"message":"Something went wrong..."}}
```
:::
