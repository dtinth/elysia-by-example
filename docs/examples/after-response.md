<!-- This file is automatically-generated. Do not edit. -->

<template v-if="false">

> [!CAUTION]
> This file has been automatically generated from the [examples in the `examples/after-response` directory.](https://github.com/dtinth/elysia-by-example/tree/main/examples/after-response).
> Do not directly edit this file, as it will be overwritten.
> [[View the live site here.]](https://dtinth.github.io/elysia-by-example/examples/after-response.html)

</template>


# afterResponse

```ts
// examples/after-response/quirk.example.ts
import { Elysia } from "elysia";
export default new Elysia()
  .onAfterResponse(({ response }) => {
    console.log("Response:", response);
  })
  .get("/", async () => {
    return { ok: true };
  });

```


::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000"
```

</div>

```http
HTTP/1.1 200 OK
Content-Type: application/json;charset=utf-8
Date: Fri, 20 Dec 2024 12:30:56 GMT
Content-Length: 11

{"ok":true}
```

<div style="margin-top: 0.5rem" class="language-ansi"><span class="lang">console output</span><pre style="background: black"><code style="color: white">Response: { ok: <span style="color:#A50">true<span style="color:#FFF"> }</span></span></code></pre></div>

:::
