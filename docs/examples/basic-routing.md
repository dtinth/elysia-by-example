<!-- This file is automatically-generated. Do not edit. -->

<template v-if="false">

> [!CAUTION]
> This file has been automatically generated from the [examples in the `examples/basic-routing` directory.](https://github.com/dtinth/elysia-by-example/tree/main/examples/basic-routing).
> Do not directly edit this file, as it will be overwritten.
> [[View the live site here.]](https://dtinth.github.io/elysia-by-example/examples/basic-routing.html)

</template>


# Basic Routing

Define routes by calling the `.get`, `.post`, `.put`, `.patch`, and `.delete` methods on an Elysia app.


## Just routing

::: danger Not idiomatic
The following code is not idiomatic Elysia code. We will gradually refactor it to idiomatic Elysia in the following examples.
:::

```ts
// examples/basic-routing/1-basics.example.ts
import { Elysia } from "elysia";
export default new Elysia()
  .get("/", async ({ request }) => {
    return new Response("it is working!", { status: 200 });
  })
  .get("/greeting", async ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get("name") || "world";
    const greeting = `hello ${name}`;
    return new Response(greeting, { status: 200 });
  });

```


A route takes 3 arguments:

1. The pathname pattern.
2. The handler function which receives a `context` object and resolves to a response.
   - In this example, the `context` contains (among others) the `request` property which refers to the original `Request` object.
   - It is customary to use destructuring to extract the properties you need from the `context` object. When you use destructuring, Elysia can statically analyze your function’s argument list to determine which context properties it’s actually using. This helps Elysia to optimize its performance.
3. An optional `options` object.
   - In this example, we don’t specify any options, but they will be useful in future examples.


::: details Example request: `GET /`

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000" 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Fri, 20 Dec 2024 12:30:56 GMT
Content-Length: 14

it is working!
```
:::


::: details Example request: `GET /greeting`

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/greeting" 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Fri, 20 Dec 2024 12:30:56 GMT
Content-Length: 11

hello world
```
:::


::: details Example request: `GET /greeting?name=alice`

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/greeting?name=alice" 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Fri, 20 Dec 2024 12:30:56 GMT
Content-Length: 11

hello alice
```
:::


::: details Example request: `GET /nonexistent`

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/nonexistent" 
```

</div>

```http
HTTP/1.1 404 Not Found
content-type: text/plain;charset=utf-8
Date: Fri, 20 Dec 2024 12:30:56 GMT
Content-Length: 9

NOT_FOUND
```
:::


::: details Example request: `POST /`

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000" -X POST 
```

</div>

```http
HTTP/1.1 404 Not Found
content-type: text/plain;charset=utf-8
Date: Fri, 20 Dec 2024 12:30:56 GMT
Content-Length: 9

NOT_FOUND
```
:::

## Returning non-Response values
If your route handler returns a value that is not a `Response` object, Elysia will convert it to a `Response` object for you.
```ts
// examples/basic-routing/2-return.example.ts
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

```

By default, if your route handler returns a `string`, it will be converted to a `Response` object with the `content-type` header set to `text/plain;charset=utf-8`.

::: details Example request: `GET /`

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000" 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Fri, 20 Dec 2024 12:30:56 GMT
Content-Length: 14

it is working!
```
:::

## Letting Elysia parse the query string
Elysia also provides the `query` property on the `context` object, which is an object containing the query parameters.
```ts
// examples/basic-routing/3-query.example.ts
import { Elysia } from "elysia";
export default new Elysia()
  .get("/", async () => {
    return "it is working!";
  })
  .get("/greeting", async ({ query }) => {
    const name = query["name"] || "world"; // [!code highlight]
    return `hello ${name}`;
  });

```


::: details Example request: `GET /greeting`

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/greeting" 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Fri, 20 Dec 2024 12:30:56 GMT
Content-Length: 11

hello world
```
:::


::: details Example request: `GET /greeting?name=alice`

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/greeting?name=alice" 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Fri, 20 Dec 2024 12:30:56 GMT
Content-Length: 11

hello alice
```
:::
