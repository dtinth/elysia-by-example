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
Date: Mon, 23 Dec 2024 17:42:23 GMT
Content-Length: 11

{"ok":true}
```

<div style="margin-top: 0.5rem" class="language-ansi"><span class="lang">console output</span><pre style="background: black"><code style="color: white"><span v-html="&quot;Response: { ok: &lt;span style=\&quot;color:#A50\&quot;&gt;true&lt;span style=\&quot;color:#FFF\&quot;&gt; }&lt;/span&gt;&lt;/span&gt;&quot;"></span></code></pre></div>

:::
