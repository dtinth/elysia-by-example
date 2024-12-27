<!-- This file is automatically-generated. Do not edit. -->

<template v-if="false">

> [!CAUTION]
> This file has been automatically generated from the [examples in the `examples/intro` directory.](https://github.com/dtinth/elysia-by-example/tree/main/examples/intro).
> Do not directly edit this file, as it will be overwritten.
> [[View the live site here.]](https://dtinth.github.io/elysia-by-example/examples/intro.html)

</template>


# Introduction

This section introduces how I integrate Elysia with Bun.


## Running a web server with Bun

In Bun, you can start a web server without having to explicitly call
the [`Bun.serve()`](https://bun.sh/docs/api/http) method.
Instead, you can just [`export default` an object that has a `fetch` method](https://bun.sh/docs/api/http#export-default-syntax).

The `fetch()` method should:

1. Accept a `Request` object.
2. Return a `Response` object.

```ts
// examples/intro/1-hello.example.ts
export default {
  async fetch(request: Request) {
    return new Response("hello world", { status: 200 });
  },
};

```

## Running the example

When you run:
```sh
bun examples/intro/1-hello.example.ts
```

You should see:
```
Started development server: http://localhost:3000
```

- You can configure the listening port by setting the `PORT` environment variable.
- If you set `NODE_ENV=production`, it will say “Started server” instead of “Started development server”.


::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- http://localhost:3000
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:45 GMT
Content-Length: 11

hello world
```
:::

## Handling requests

Here’s a slightly more complex example that shows how to handle requests.

```ts
// examples/intro/2-query.example.ts
export default {
  async fetch(request: Request) {
    // Parse the request URL.
    const url = new URL(request.url);

    // Extract the `name` query parameter (with a default value).
    const name = url.searchParams.get("name") || "world";

    // Create a greeting message.
    const greeting = `hello ${name}`;

    // Return a Response.
    return new Response(greeting, { status: 200 });
  },
};

```


::: details Example request: No query parameter

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- http://localhost:3000 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:45 GMT
Content-Length: 11

hello world
```
:::


::: details Example request: With a `name` query parameter

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000?name=alice" 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:45 GMT
Content-Length: 11

hello alice
```
:::


This fetch handler is called for every request, regardless of the HTTP method or path.


::: details Example request: PUT request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- -X PUT http://localhost:3000 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:45 GMT
Content-Length: 11

hello world
```
:::


::: details Example request: A request with arbitrary path

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- -X PUT http://localhost:3000/this/is/irrelevant 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:45 GMT
Content-Length: 11

hello world
```
:::


Therefore, it is up to the handler to decide how to respond to the request.

Deciding what to do based on the request method and path combination is the job of the **router**.
Elysia is one such router that you can use with Bun.
However, you can also manually handle routes without a router, as shown in the next example.
## Manually handling routes without a router

We can manually handle routes by checking the request URL’s pathname and method.

```ts
// examples/intro/3-route.example.ts
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      // Handle GET /
      return new Response("it is working!", { status: 200 });
    } else if (request.method === "GET" && url.pathname === "/greeting") {
      // Handle GET /greeting
      const name = url.searchParams.get("name") || "world";
      const greeting = `hello ${name}`;
      return new Response(greeting, { status: 200 });
    } else {
      // Handle everything else
      return new Response("not found", { status: 404 });
    }
  },
};

```


::: details Example request: `GET /`

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000" 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:45 GMT
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
Date: Wed, 25 Dec 2024 09:38:45 GMT
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
Date: Wed, 25 Dec 2024 09:38:45 GMT
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
Date: Wed, 25 Dec 2024 09:38:45 GMT
Content-Length: 9

not found
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
Date: Wed, 25 Dec 2024 09:38:45 GMT
Content-Length: 9

not found
```
:::


Now let’s introduce Elysia and then see how it simplifies routing, request handling, response creation, and more.