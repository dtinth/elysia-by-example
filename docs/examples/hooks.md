<!-- This file is automatically-generated. Do not edit. -->

<template v-if="false">

> [!CAUTION]
> This file has been automatically generated from the [examples in the `examples/hooks` directory.](https://github.com/dtinth/elysia-by-example/tree/main/examples/hooks).
> Do not directly edit this file, as it will be overwritten.
> [[View the live site here.]](https://dtinth.github.io/elysia-by-example/examples/hooks.html)

</template>


# Hooks

Elysia provides hooks to tap into the [request lifecycle](https://elysiajs.com/essential/life-cycle.html).


## Listing all available hooks

```ts
// examples/hooks/1-list.example.ts
import Elysia from "elysia";

const hookNames: string[] = [];
const app = new Elysia().get("/", () => hookNames);
for (const [eventName, handlers] of Object.entries(app.event)) {
  if (Array.isArray(handlers)) hookNames.push(eventName);
}

export default app;

```


::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- http://localhost:3000
```

</div>

```http
HTTP/1.1 200 OK
Content-Type: application/json;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:44 GMT
Content-Length: 121

["start","request","parse","transform","beforeHandle","afterHandle","mapResponse","afterResponse","trace","error","stop"]
```
:::

## Available context properties inside each hook
```ts
// examples/hooks/2-log.example.ts
import { Elysia } from "elysia";

const logContext = (name: string, context: any) => {
  console.log(
    `[${name}]`.padEnd(17),
    `{ ${Object.keys(context).sort().join(", ")} }`,
  );
};

// XXX: Temporarily enable `aot: false` to work around a bug introduced in Elysia v1.2.2
// See: https://github.com/elysiajs/elysia/issues/965
export default new Elysia({ aot: false })
  .onRequest((context) => logContext("onRequest", context))
  .onParse((context) => logContext("onParse", context))
  .onTransform((context) => logContext("onTransform", context))
  .onBeforeHandle((context) => logContext("onBeforeHandle", context))
  .onAfterHandle((context) => logContext("onAfterHandle", context))
  .mapResponse((context) => {
    logContext("mapResponse", context);
    return context.response;
  })
  .onAfterResponse((context) => logContext("onAfterResponse", context))
  .onError((context) => logContext("onError", context))
  .post("/", async (context) => {
    logContext("handler", context);
    if (context.query["crash"]) throw new Error("crash");
    return "ok";
  });

```


::: details Example request: A successful request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- http://localhost:3000 -X POST -d x=1 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:44 GMT
Content-Length: 2

ok
```

<div style="margin-top: 0.5rem" class="language-ansi"><span class="lang">console output</span><pre style="background: black"><code style="color: white"><span v-html="&quot;[onRequest]       { path, qi, redirect, request, set, store }&lt;br/&gt;[onParse]         { contentType, path, qi, redirect, request, set, store }&lt;br/&gt;[onTransform]     { body, cookie, headers, params, path, qi, query, redirect, request, set, store }&lt;br/&gt;[onBeforeHandle]  { body, cookie, headers, params, path, qi, query, redirect, request, set, store }&lt;br/&gt;[handler]         { body, cookie, headers, params, path, qi, query, redirect, request, set, store }&lt;br/&gt;[onAfterHandle]   { body, cookie, headers, params, path, qi, query, redirect, request, response, set, store }&lt;br/&gt;[onAfterResponse] { body, cookie, headers, params, path, qi, query, redirect, request, response, set, store }&quot;"></span></code></pre></div>

:::


::: details Example request: A crashing request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000?crash=1" -X POST -d x=1 
```

</div>

```http
HTTP/1.1 500 Internal Server Error
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:44 GMT
Content-Length: 5

crash
```

<div style="margin-top: 0.5rem" class="language-ansi"><span class="lang">console output</span><pre style="background: black"><code style="color: white"><span v-html="&quot;[onRequest]       { path, qi, redirect, request, set, store }&lt;br/&gt;[onParse]         { contentType, path, qi, redirect, request, set, store }&lt;br/&gt;[onTransform]     { body, cookie, headers, params, path, qi, query, redirect, request, set, store }&lt;br/&gt;[onBeforeHandle]  { body, cookie, headers, params, path, qi, query, redirect, request, set, store }&lt;br/&gt;[handler]         { body, cookie, headers, params, path, qi, query, redirect, request, set, store }&lt;br/&gt;[onError]         { body, code, cookie, error, headers, params, path, qi, query, redirect, request, set, store }&lt;br/&gt;[onAfterResponse] { body, code, cookie, error, headers, params, path, qi, query, redirect, request, set, store }&quot;"></span></code></pre></div>

:::

## Most hooks are route-specific
It can be useful to think of hooks as if **each route has its own set of hooks**.
When you declare a hook, it only affects the routes declared after it.
```ts
// examples/hooks/3-order.example.ts
import { Elysia } from "elysia";

export default new Elysia()
  .get("/a", () => "a")
  .onBeforeHandle(() => console.log("onBeforeHandle"))
  .get("/b", () => "b");

```

In this example, the `onBeforeHandle` hook only applies to the `/b` route.

When you make a request to `/a`, you will not see the log message.

::: details Example request: GET /a

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/a" 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:44 GMT
Content-Length: 1

a
```
:::


But when you make a request to `/b`, you will see the log message.

::: details Example request: GET /b

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/b" 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:44 GMT
Content-Length: 1

b
```

<div style="margin-top: 0.5rem" class="language-ansi"><span class="lang">console output</span><pre style="background: black"><code style="color: white"><span v-html="&quot;onBeforeHandle&quot;"></span></code></pre></div>

:::


::: tip Mental model

I like to think of Elysia as a route generator that maintains a current list of hooks that should be applied to future routes.

- When you declare a hook, it's added to this list.
- When you declare a route, the current list of hooks (at that point in time) is copied into that route.

This explains how:

- Hooks only affect routes declared after them
- Each route has its own set of hooks

This mental model will become especially useful when we later incorporate
_local hooks_ and _plugins_ into the picture.
:::
## `onRequest` hook is not route-specific
The `onRequest` hook is an exception to the rule, because `onRequest` is called **outside** the router (i.e. it is called even before the router sees the request).
```ts
// examples/hooks/4-request.example.ts
import { Elysia } from "elysia";

export default new Elysia()
  .get("/a", () => "a")
  .onRequest(() => console.log("onRequest"))
  .get("/b", () => "b");

```

In this example, the `onRequest` hook applies to both routes.

When you make a request to `/a`, you will not see the log message.

::: details Example request: GET /a

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/a" 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:44 GMT
Content-Length: 1

a
```

<div style="margin-top: 0.5rem" class="language-ansi"><span class="lang">console output</span><pre style="background: black"><code style="color: white"><span v-html="&quot;onRequest&quot;"></span></code></pre></div>

:::


But when you make a request to `/b`, you will see the log message.

::: details Example request: GET /b

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/b" 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:44 GMT
Content-Length: 1

b
```

<div style="margin-top: 0.5rem" class="language-ansi"><span class="lang">console output</span><pre style="background: black"><code style="color: white"><span v-html="&quot;onRequest&quot;"></span></code></pre></div>

:::

## Local hooks
You can also define hooks **directly** on the route.

```ts
// examples/hooks/5-local-intro.example.ts
import { Elysia } from "elysia";

export default new Elysia()
  .get("/a", () => "a", {
    beforeHandle: () => console.log("[local] onBeforeHandle"),
  })
  .get("/b", () => "b");

```

Here, a `beforeHandle` hook is defined **locally** on the `/a` route.

::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/a"
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:44 GMT
Content-Length: 1

a
```

<div style="margin-top: 0.5rem" class="language-ansi"><span class="lang">console output</span><pre style="background: black"><code style="color: white"><span v-html="&quot;[local] onBeforeHandle&quot;"></span></code></pre></div>

:::


::: tip Types of hook
We have now seen both types of hooks. Now let’s name these concepts:

- **Local hooks** are hooks defined directly on the route.
- **Interceptor hooks** are hooks defined on the Elysia instance and applies to routes that come after it.
:::
### Combined example

```ts
// examples/hooks/6-local.example.ts
import { Elysia } from "elysia";

export default new Elysia()
  .get("/a", () => "a")
  .onBeforeHandle(() => console.log("[interceptor] onBeforeHandle"))
  .get("/b", () => "b", {
    beforeHandle: () => console.log("[local] onBeforeHandle"),
  })
  .get("/c", () => "c")
  .onRequest(() => console.log("[interceptor] onRequest"));

```


::: details Example request: GET /a

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/a" 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:44 GMT
Content-Length: 1

a
```

<div style="margin-top: 0.5rem" class="language-ansi"><span class="lang">console output</span><pre style="background: black"><code style="color: white"><span v-html="&quot;[interceptor] onRequest&quot;"></span></code></pre></div>

:::


::: details Example request: GET /b

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/b" 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:44 GMT
Content-Length: 1

b
```

<div style="margin-top: 0.5rem" class="language-ansi"><span class="lang">console output</span><pre style="background: black"><code style="color: white"><span v-html="&quot;[interceptor] onRequest&lt;br/&gt;[interceptor] onBeforeHandle&lt;br/&gt;[local] onBeforeHandle&quot;"></span></code></pre></div>

:::


::: details Example request: GET /c

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/c" 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:44 GMT
Content-Length: 1

c
```

<div style="margin-top: 0.5rem" class="language-ansi"><span class="lang">console output</span><pre style="background: black"><code style="color: white"><span v-html="&quot;[interceptor] onRequest&lt;br/&gt;[interceptor] onBeforeHandle&quot;"></span></code></pre></div>

:::
