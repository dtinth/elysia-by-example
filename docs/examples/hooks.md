<!-- This file is automatically-generated. Do not edit. -->

<template v-if="false">

> [!CAUTION]
> This file has been automatically generated from the [examples in the `examples/hooks` directory.](https://github.com/dtinth/elysia-by-example/tree/main/examples/hooks).
> Do not directly edit this file, as it will be overwritten.
> [[View the live site here.]](https://dtinth.github.io/elysia-by-example/examples/hooks.html)

</template>


# Hooks

Elysia provides hooks to tap into the request lifecycle.


## Listing all available hooks

```ts
// examples/hooks/list.example.ts
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
Date: Fri, 20 Dec 2024 12:30:56 GMT
Content-Length: 121

["start","request","parse","transform","beforeHandle","afterHandle","mapResponse","afterResponse","trace","error","stop"]
```
:::

## Available context properties inside each hook
```ts
// examples/hooks/log.example.ts
import { Elysia } from "elysia";

const logContext = (name: string, context: any) => {
  console.log(
    `[${name}]`.padEnd(17),
    `{ ${Object.keys(context).sort().join(", ")} }`,
  );
};

export default new Elysia()
  .onRequest((context) => logContext("onRequest", context))
  .onParse((context) => logContext("onParse", context))
  .onTransform((context) => logContext("onTransform", context))
  .onBeforeHandle((context) => logContext("onBeforeHandle", context))
  .onAfterHandle((context) => logContext("onAfterHandle", context))
  .mapResponse((context) => logContext("mapResponse", context))
  .onAfterResponse((context) => logContext("onAfterResponse", context))
  .onError((context) => logContext("onError", context))
  .post("/", async (context) => {
    logContext("handler", context);
    return "ok";
  });

```


::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- http://localhost:3000 -X POST -d x=1
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Fri, 20 Dec 2024 12:30:56 GMT
Content-Length: 2

ok
```

<div style="margin-top: 0.5rem" class="language-ansi"><span class="lang">console output</span><pre style="background: black"><code style="color: white">[onRequest]       { error, path, qi, redirect, request, server, set, store, url }<br>[onParse]         { contentType, cookie, error, headers, path, qi, query, redirect, request, route, server, set, store, url }<br>[onTransform]     { body, cookie, error, headers, path, qi, query, redirect, request, route, server, set, store, url }<br>[onBeforeHandle]  { body, cookie, error, headers, path, qi, query, redirect, request, route, server, set, store, url }<br>[handler]         { body, cookie, error, headers, path, qi, query, redirect, request, route, server, set, store, url }<br>[onAfterHandle]   { body, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, store, url }<br>[mapResponse]     { body, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, store, url }<br>[onAfterResponse] { body, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, store, url }</code></pre></div>

:::
