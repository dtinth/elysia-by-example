<!-- This file is automatically-generated. Do not edit. -->

<template v-if="false">

> [!CAUTION]
> This file has been automatically generated from the [examples in the `examples/intro` directory.](https://github.com/dtinth/elysia-by-example/tree/main/examples/intro).
> Do not directly edit this file, as it will be overwritten.
> [[View the live site here.]](https://dtinth.github.io/elysia-by-example/examples/intro.html)

</template>


# Introduction

This website contains my study notes about Elysia.js, a TypeScript web framework that has significantly improved my development workflow compared to other JavaScript frameworks.

## Why Elysia.js?

Elysia.js excels in several areas:

- Developer-friendly request/response handling with minimal code
- Type-safe APIs without verbose boilerplate
- Efficient routing with great performance
- Automatic request validation through schema definitions
- Automatic OpenAPI schema generation

While Elysia.js can feel **magical** (in both good and bad ways), it's important to understand its behavior:

### The good

- Simplified request validation through schema definitions
- Automatic API documentation generation
- End-to-end type safety
- “Wow, you can do _this??_ That’s magical!”

### The challenges

- Understanding the underlying mechanics
- Finding best practices for common patterns (e.g., authentication)
- Dealing with advanced concepts like `derive`, `resolve`, `mapResponse`, `store`, and lifecycle hooks
- Debugging issues due to the framework's code generation approach
- “What’s going on here?? What kind of magic is this?”

## About this project

This **Elysia by Example** project aims to demystify Elysia.js's “magical” aspects. It is not trying to be a comprehensive guide. Rather, it’s a collection of examples that document surprising or unexpected behaviors I’ve encountered while working with Elysia.js in production applications.

Think of it as a curated list of “gotchas” and learning moments that helps demystify the framework’s behavior. When Elysia.js doesn’t behave the way I expect it to, I create minimal examples to understand and document these edge cases.

The contents of this website are generated from [`*.example.ts` files in the `dtinth/elysia-by-example` repo](https://github.com/dtinth/elysia-by-example/tree/main/examples).


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
Date: Fri, 20 Dec 2024 14:03:46 GMT
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
Date: Fri, 20 Dec 2024 14:03:46 GMT
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
Date: Fri, 20 Dec 2024 14:03:46 GMT
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
Date: Fri, 20 Dec 2024 14:03:46 GMT
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
Date: Fri, 20 Dec 2024 14:03:46 GMT
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
Date: Fri, 20 Dec 2024 14:03:46 GMT
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
Date: Fri, 20 Dec 2024 14:03:46 GMT
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
Date: Fri, 20 Dec 2024 14:03:46 GMT
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
Date: Fri, 20 Dec 2024 14:03:46 GMT
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
Date: Fri, 20 Dec 2024 14:03:46 GMT
Content-Length: 9

not found
```
:::


Now let’s introduce Elysia and then see how it simplifies routing, request handling, response creation, and more.