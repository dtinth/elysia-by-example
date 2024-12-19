<table>
<tbody>
<tr><td colspan="2">

## [00_wintercg](00_wintercg/index.ts)

</td></tr>
<tr><td width="2000" valign="top">

In Bun, you can start a web server without having to explicitly call
the `listen` method — just `export default` an object that has a
`fetch` method. It should:

1. Accept a `Request` object.
2. Return a `Response` object.

When you run:

~~~sh
bun examples/00_wintercg/index.ts
~~~

You should see:

~~~
Started development server: http://localhost:3000
~~~

- You can configure the listening port by setting the `PORT` environment variable.
- If you set `NODE_ENV=production`, it will say “Started server” instead of “Started development server”.

</td><td width="2000" valign="top">

```ts
export default {
  fetch(request: Request) {
    // Parse the URL
    const url = new URL(request.url);

    // Extract the "name" query parameter
    const name =
      url.searchParams.get("name") || "world";

    // Return a response
    return new Response("hello " + name, {
      status: 200,
    });
  },
};
```

</td></tr>
<tr><td colspan="2">
<table><tr><td><details><summary>GET / — basic request</summary>

```sh-session
$ curl -s -D- "http://localhost:3000/"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Thu, 19 Dec 2024 18:10:44 GMT
Content-Length: 11

hello world
```

</details></td></tr></table>
<table><tr><td><details><summary>GET /?name=alice — with query parameters</summary>

```sh-session
$ curl -s -D- "http://localhost:3000/?name=alice"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Thu, 19 Dec 2024 18:10:44 GMT
Content-Length: 11

hello alice
```

</details></td></tr></table>
<table><tr><td><details><summary>GET /arbitrary-path?name=bob — arbitrary path</summary>

The fetch handler is called for every request, so paths like "/arbitrary-path" work too.

```sh-session
$ curl -s -D- "http://localhost:3000/arbitrary-path?name=bob"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Thu, 19 Dec 2024 18:10:44 GMT
Content-Length: 9

hello bob
```

</details></td></tr></table>
</td></tr>
<tr><td colspan="2">

## [01_intro](01_intro/index.ts)

</td></tr>
<tr><td width="2000" valign="top">

Elysia implements such an interface.
That means you can `export default` an Elysia app and it will start a server when run with Bun.

Right now, the server does not have any routes, so it will return a 404 response for any request.

</td><td width="2000" valign="top">

```ts
import { Elysia } from "elysia";
export default new Elysia();
```

</td></tr>
<tr><td colspan="2">
<table><tr><td><details><summary>GET / — basic request</summary>

```sh-session
$ curl -s -D- "http://localhost:3000/"
HTTP/1.1 404 Not Found
content-type: text/plain;charset=utf-8
Date: Thu, 19 Dec 2024 18:10:44 GMT
Content-Length: 9

NOT_FOUND
```

</details></td></tr></table>
</td></tr>
<tr><td colspan="2">

## [02_route](02_route/index.ts)

</td></tr>
<tr><td width="2000" valign="top">

You can define routes by calling the `.get`, `.post`, `.put`, `.patch`, and `.delete` methods on an Elysia app.

It takes 3 arguments:

1. The pathname pattern.
2. The handler function which receives a `context` object and returns a response.
3. An optional options object.

The `context` object contains many properties. One of which is the original `request` object.

When accessing the `context` object, it is customary to use destructuring to extract the properties you need.
When you use destructuring, Elysia can statically analyze your function’s argument list to determine which context properties it’s actually using.
This helps Elysia to optimize its performance.

</td><td width="2000" valign="top">

```ts
import { Elysia } from "elysia";
export default new Elysia().get(
  // Pathname
  "/",

  // Handler
  ({ request }) => {
    const url = new URL(request.url);
    const name =
      url.searchParams.get("name") || "world";
    return new Response("hello " + name, {
      status: 200,
    });
  },

  // No options for now...
);
```

</td></tr>
<tr><td colspan="2">
<table><tr><td><details><summary>GET / — basic request</summary>

```sh-session
$ curl -s -D- "http://localhost:3000/"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Thu, 19 Dec 2024 18:10:44 GMT
Content-Length: 11

hello world
```

</details></td></tr></table>
<table><tr><td><details><summary>GET /?name=alice — with query parameters</summary>

```sh-session
$ curl -s -D- "http://localhost:3000/?name=alice"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Thu, 19 Dec 2024 18:10:44 GMT
Content-Length: 11

hello alice
```

</details></td></tr></table>
<table><tr><td><details><summary>GET /arbitrary-path — arbitrary path</summary>

```sh-session
$ curl -s -D- "http://localhost:3000/arbitrary-path"
HTTP/1.1 404 Not Found
content-type: text/plain;charset=utf-8
Date: Thu, 19 Dec 2024 18:10:44 GMT
Content-Length: 9

NOT_FOUND
```

This time, we only defined a route for "/", so this request returned a 404 response.

</details></td></tr></table>
</td></tr>
<tr><td colspan="2">

## [03_return](03_return/index.ts)

</td></tr>
<tr><td width="2000" valign="top">

In Elysia, when you return a non-Response object from a route handler,
Elysia will convert it to a Response object for you.

For example, a string will be converted to a `text/plain` response.

</td><td width="2000" valign="top">

```ts
import { Elysia } from "elysia";
export default new Elysia().get(
  "/",
  ({ request }) => {
    const url = new URL(request.url);
    const name =
      url.searchParams.get("name") || "world";
    return "hello " + name;
  },
);
```

</td></tr>
<tr><td colspan="2">
<table><tr><td><details><summary>GET / — basic request</summary>

```sh-session
$ curl -s -D- "http://localhost:3000/"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Thu, 19 Dec 2024 18:10:44 GMT
Content-Length: 11

hello world
```

</details></td></tr></table>
</td></tr>
<tr><td colspan="2">

## [04_parse](04_parse/index.ts)

</td></tr>
<tr><td width="2000" valign="top">

The context also contains a `query` property which is an object containing the query parameters.

</td><td width="2000" valign="top">

```ts
import { Elysia } from "elysia";
export default new Elysia().get(
  "/",
  ({ query }) => {
    const name = query["name"] || "world";
    return "hello " + name;
  },
);
```

</td></tr>
<tr><td colspan="2">
<table><tr><td><details><summary>GET / — basic request</summary>

```sh-session
$ curl -s -D- "http://localhost:3000/"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Thu, 19 Dec 2024 18:10:44 GMT
Content-Length: 11

hello world
```

</details></td></tr></table>
<table><tr><td><details><summary>GET /?name=alice — with query parameters</summary>

```sh-session
$ curl -s -D- "http://localhost:3000/?name=alice"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Thu, 19 Dec 2024 18:10:44 GMT
Content-Length: 11

hello alice
```

</details></td></tr></table>
</td></tr>
</tbody></table>
