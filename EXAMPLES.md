<table>
<tbody>
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
<table><tr><td><details><summary>GET /</summary>

```sh-session
$ curl -s -D- "http://localhost:3000/"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Thu, 19 Dec 2024 17:49:52 GMT
Content-Length: 11

hello world
```

</details></td></tr></table>
<table><tr><td><details><summary>GET /?name=alice</summary>

```sh-session
$ curl -s -D- "http://localhost:3000/?name=alice"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Thu, 19 Dec 2024 17:49:52 GMT
Content-Length: 11

hello alice
```

</details></td></tr></table>
<table><tr><td><details><summary>GET /arbitrary-path?name=bob</summary>

The fetch handler is called for every request, so paths like "/arbitrary-path" work too.

```sh-session
$ curl -s -D- "http://localhost:3000/arbitrary-path?name=bob"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Thu, 19 Dec 2024 17:49:52 GMT
Content-Length: 9

hello bob
```

</details></td></tr></table>
</td></tr>
<tr><td width="2000" valign="top">

You can define routes by calling the `.get`, `.post`, `.put`, `.patch`, and `.delete` methods on an Elysia app.

It takes 3 arguments:

1. The pathname pattern.
2. The handler function.
3. An optional options object.

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
<table><tr><td><details><summary>GET /</summary>

```sh-session
$ curl -s -D- "http://localhost:3000/"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Thu, 19 Dec 2024 17:49:52 GMT
Content-Length: 11

hello world
```

</details></td></tr></table>
<table><tr><td><details><summary>GET /?name=alice</summary>

```sh-session
$ curl -s -D- "http://localhost:3000/?name=alice"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Thu, 19 Dec 2024 17:49:52 GMT
Content-Length: 11

hello alice
```

</details></td></tr></table>
<table><tr><td><details><summary>GET /arbitrary-path</summary>

```sh-session
$ curl -s -D- "http://localhost:3000/arbitrary-path"
HTTP/1.1 404 Not Found
content-type: text/plain;charset=utf-8
Date: Thu, 19 Dec 2024 17:49:52 GMT
Content-Length: 9

NOT_FOUND
```

</details></td></tr></table>
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
<table><tr><td><details><summary>GET /</summary>

```sh-session
$ curl -s -D- "http://localhost:3000/"
HTTP/1.1 404 Not Found
content-type: text/plain;charset=utf-8
Date: Thu, 19 Dec 2024 17:49:52 GMT
Content-Length: 9

NOT_FOUND
```

</details></td></tr></table>
</td></tr>
</tbody></table>
