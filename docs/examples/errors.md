<!-- This file is automatically-generated. Do not edit. -->

<template v-if="false">

> [!CAUTION]
> This file has been automatically generated from the [examples in the `examples/errors` directory.](https://github.com/dtinth/elysia-by-example/tree/main/examples/errors).
> Do not directly edit this file, as it will be overwritten.
> [[View the live site here.]](https://dtinth.github.io/elysia-by-example/examples/errors.html)

</template>


# Errors

The following examples demonstrate how Elysia.js handles errors, and how we can implement error handling in our apps.


## Built-in Errors
```ts
// examples/errors/built-in.example.ts
import { Elysia, InternalServerError, t } from "elysia";
export default new Elysia()
  .onError(({ error, code }) => {
    console.log("[onError]", { error, code });
  })
  .get("/crash/internal", async () => {
    throw new InternalServerError("Something went wrong!");
  })
  .get("/crash/error", async () => {
    throw new Error("Something went wrong!");
  })
  .post("/body", async ({ body }) => ({ body }))
  .get("/validate", async () => "Validation passed", {
    query: t.Object({ name: t.String() }),
  })
  .get("/cookie", async ({ cookie }) => cookie.name.value, {
    cookie: t.Cookie(
      { name: t.String() },
      { secrets: "something", sign: ["name"] },
    ),
  });

```

### Not found
This happens when the requested path does not match any route.

- Status: 404 Not Found
- Error class: `NotFoundError`
- Code: `NOT_FOUND`

::: details Example request: `GET /nonexistent`

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- http://localhost:3000/nonexistent 
```

</div>

```http
HTTP/1.1 404 Not Found
content-type: text/plain;charset=utf-8
Date: Mon, 23 Dec 2024 18:49:21 GMT
Content-Length: 9

NOT_FOUND
```

<div style="margin-top: 0.5rem" class="language-ansi"><span class="lang">console output</span><pre style="background: black"><code style="color: white"><span v-html="&quot;[onError] {&lt;br/&gt;  error: NotFoundError: NOT_FOUND&lt;br/&gt;      at new NotFoundError &lt;span style=\&quot;color:#555\&quot;&gt;(/Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;node_modules/&lt;u&gt;elysia&lt;/u&gt;/src/error.ts:77:3&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at anonymous &lt;span style=\&quot;color:#555\&quot;&gt;(file:///Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;node_modules/&lt;u&gt;elysia&lt;/u&gt;/dist/bun/index.js:11:33&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at fetch &lt;span style=\&quot;color:#555\&quot;&gt;(/Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;node_modules/&lt;u&gt;elysia&lt;/u&gt;/src/index.ts:5970:6&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at &lt;anonymous&gt; &lt;span style=\&quot;color:#555\&quot;&gt;(/Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;index.ts:222:26&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at fetch &lt;span style=\&quot;color:#555\&quot;&gt;(/Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;index.ts:221:21&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt; {&lt;br/&gt;    code: &lt;span style=\&quot;color:#0A0\&quot;&gt;&#x27;NOT_FOUND&#x27;&lt;span style=\&quot;color:#FFF\&quot;&gt;,&lt;br/&gt;    status: &lt;span style=\&quot;color:#A50\&quot;&gt;404&lt;span style=\&quot;color:#FFF\&quot;&gt;,&lt;br/&gt;    originalLine: &lt;span style=\&quot;color:#A50\&quot;&gt;2&lt;span style=\&quot;color:#FFF\&quot;&gt;,&lt;br/&gt;    originalColumn: &lt;span style=\&quot;color:#A50\&quot;&gt;29444&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;  },&lt;br/&gt;  code: &lt;span style=\&quot;color:#0A0\&quot;&gt;&#x27;NOT_FOUND&#x27;&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;}&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&quot;"></span></code></pre></div>

:::


### Body parsing error
This happens when the request body cannot be parsed.

- Status: 400 Bad Request
- Error class: `ParseError`
- Code: `PARSE`

::: details Example request: `POST /body`

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- http://localhost:3000/body -X POST -H "Content-Type: application/json" -d '{' 
```

</div>

```http
HTTP/1.1 500 Internal Server Error
content-type: text/plain;charset=utf-8
Date: Mon, 23 Dec 2024 18:49:21 GMT
Content-Length: 55

{"name":"SyntaxError","message":"Failed to parse JSON"}
```

<div style="margin-top: 0.5rem" class="language-ansi"><span class="lang">console output</span><pre style="background: black"><code style="color: white"><span v-html="&quot;[onError] { error: [SyntaxError: Failed to parse JSON], code: &lt;span style=\&quot;color:#0A0\&quot;&gt;&#x27;UNKNOWN&#x27;&lt;span style=\&quot;color:#FFF\&quot;&gt; }&lt;/span&gt;&lt;/span&gt;&quot;"></span></code></pre></div>

:::


### Validation error
This happens when the request can be parsed, but does not match the schema.
It also happens when you specify a response schema and the response from your application does not match it.

- Status: 422 Unprocessable Entity
- Error class: `ValidationError`
- Code: `VALIDATION`

::: details Example request: `GET /validate`

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- http://localhost:3000/validate 
```

</div>

```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json
Date: Mon, 23 Dec 2024 18:49:21 GMT
Content-Length: 682

{
  "type": "validation",
  "on": "query",
  "summary": "Property 'name' is missing",
  "property": "/name",
  "message": "Expected required property",
  "expected": {
    "name": ""
  },
  "found": {},
  "errors": [
    {
      "type": 45,
      "schema": {
        "type": "string"
      },
      "path": "/name",
      "message": "Expected required property",
      "errors": [],
      "summary": "Property 'name' is missing"
    },
    {
      "type": 54,
      "schema": {
        "type": "string"
      },
      "path": "/name",
      "message": "Expected string",
      "errors": [],
      "summary": "Expected  property 'name' to be  string but found: undefined"
    }
  ]
}
```

<div style="margin-top: 0.5rem" class="language-ansi"><span class="lang">console output</span><pre style="background: black"><code style="color: white"><span v-html="&quot;[onError] {&lt;br/&gt;  error: ValidationError: {&lt;br/&gt;    \&quot;type\&quot;: \&quot;validation\&quot;,&lt;br/&gt;    \&quot;on\&quot;: \&quot;query\&quot;,&lt;br/&gt;    \&quot;summary\&quot;: \&quot;Property &#x27;name&#x27; is missing\&quot;,&lt;br/&gt;    \&quot;property\&quot;: \&quot;/name\&quot;,&lt;br/&gt;    \&quot;message\&quot;: \&quot;Expected required property\&quot;,&lt;br/&gt;    \&quot;expected\&quot;: {&lt;br/&gt;      \&quot;name\&quot;: \&quot;\&quot;&lt;br/&gt;    },&lt;br/&gt;    \&quot;found\&quot;: {},&lt;br/&gt;    \&quot;errors\&quot;: [&lt;br/&gt;      {&lt;br/&gt;        \&quot;type\&quot;: 45,&lt;br/&gt;        \&quot;schema\&quot;: {&lt;br/&gt;          \&quot;type\&quot;: \&quot;string\&quot;&lt;br/&gt;        },&lt;br/&gt;        \&quot;path\&quot;: \&quot;/name\&quot;,&lt;br/&gt;        \&quot;message\&quot;: \&quot;Expected required property\&quot;,&lt;br/&gt;        \&quot;errors\&quot;: [],&lt;br/&gt;        \&quot;summary\&quot;: \&quot;Property &#x27;name&#x27; is missing\&quot;&lt;br/&gt;      },&lt;br/&gt;      {&lt;br/&gt;        \&quot;type\&quot;: 54,&lt;br/&gt;        \&quot;schema\&quot;: {&lt;br/&gt;          \&quot;type\&quot;: \&quot;string\&quot;&lt;br/&gt;        },&lt;br/&gt;        \&quot;path\&quot;: \&quot;/name\&quot;,&lt;br/&gt;        \&quot;message\&quot;: \&quot;Expected string\&quot;,&lt;br/&gt;        \&quot;errors\&quot;: [],&lt;br/&gt;        \&quot;summary\&quot;: \&quot;Expected  property &#x27;name&#x27; to be  string but found: undefined\&quot;&lt;br/&gt;      }&lt;br/&gt;    ]&lt;br/&gt;  }&lt;br/&gt;      at new ValidationError &lt;span style=\&quot;color:#555\&quot;&gt;(/Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;node_modules/&lt;u&gt;elysia&lt;/u&gt;/src/error.ts:264:3&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at &lt;anonymous&gt; &lt;span style=\&quot;color:#555\&quot;&gt;(file:///Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;node_modules/&lt;u&gt;elysia&lt;/u&gt;/dist/bun/index.js:14:86&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at handle &lt;span style=\&quot;color:#555\&quot;&gt;(file:///Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;node_modules/&lt;u&gt;elysia&lt;/u&gt;/dist/bun/index.js:5:80&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at map &lt;span style=\&quot;color:#555\&quot;&gt;(file:///Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;node_modules/&lt;u&gt;elysia&lt;/u&gt;/dist/bun/index.js:26:102&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at &lt;anonymous&gt; &lt;span style=\&quot;color:#555\&quot;&gt;(/Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;index.ts:222:26&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at fetch &lt;span style=\&quot;color:#555\&quot;&gt;(/Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;index.ts:221:21&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt; {&lt;br/&gt;    type: &lt;span style=\&quot;color:#0A0\&quot;&gt;&#x27;query&#x27;&lt;span style=\&quot;color:#FFF\&quot;&gt;,&lt;br/&gt;    validator: TypeCheck {&lt;br/&gt;      schema: &lt;span style=\&quot;color:#0AA\&quot;&gt;[Object]&lt;span style=\&quot;color:#FFF\&quot;&gt;,&lt;br/&gt;      references: [],&lt;br/&gt;      checkFunc: &lt;span style=\&quot;color:#0AA\&quot;&gt;[Function: check]&lt;span style=\&quot;color:#FFF\&quot;&gt;,&lt;br/&gt;      code: &lt;span style=\&quot;color:#0A0\&quot;&gt;&#x27;return function check(value) {\\n&#x27;&lt;span style=\&quot;color:#FFF\&quot;&gt; +&lt;br/&gt;        &lt;span style=\&quot;color:#0A0\&quot;&gt;&#x27;  return (\\n&#x27;&lt;span style=\&quot;color:#FFF\&quot;&gt; +&lt;br/&gt;        &lt;span style=\&quot;color:#0A0\&quot;&gt;\&quot;    (typeof value === &#x27;object&#x27; &amp;&amp; value !== null &amp;&amp; !Array.isArray(value)) &amp;&amp;\\n\&quot;&lt;span style=\&quot;color:#FFF\&quot;&gt; +&lt;br/&gt;        &lt;span style=\&quot;color:#0A0\&quot;&gt;\&quot;    (typeof value.name === &#x27;string&#x27;) &amp;&amp;\\n\&quot;&lt;span style=\&quot;color:#FFF\&quot;&gt; +&lt;br/&gt;        &lt;span style=\&quot;color:#0A0\&quot;&gt;&#x27;    Object.getOwnPropertyNames(value).length === 1\\n&#x27;&lt;span style=\&quot;color:#FFF\&quot;&gt; +&lt;br/&gt;        &lt;span style=\&quot;color:#0A0\&quot;&gt;&#x27;  )\\n&#x27;&lt;span style=\&quot;color:#FFF\&quot;&gt; +&lt;br/&gt;        &lt;span style=\&quot;color:#0A0\&quot;&gt;&#x27;}&#x27;&lt;span style=\&quot;color:#FFF\&quot;&gt;,&lt;br/&gt;      hasTransform: &lt;span style=\&quot;color:#A50\&quot;&gt;false&lt;span style=\&quot;color:#FFF\&quot;&gt;,&lt;br/&gt;      Clean: &lt;span style=\&quot;color:#0AA\&quot;&gt;[Function (anonymous)]&lt;span style=\&quot;color:#FFF\&quot;&gt;,&lt;br/&gt;      parse: &lt;span style=\&quot;color:#0AA\&quot;&gt;[Function (anonymous)]&lt;span style=\&quot;color:#FFF\&quot;&gt;,&lt;br/&gt;      safeParse: &lt;span style=\&quot;color:#0AA\&quot;&gt;[Function (anonymous)]&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;    },&lt;br/&gt;    value: {},&lt;br/&gt;    code: &lt;span style=\&quot;color:#0A0\&quot;&gt;&#x27;VALIDATION&#x27;&lt;span style=\&quot;color:#FFF\&quot;&gt;,&lt;br/&gt;    status: &lt;span style=\&quot;color:#A50\&quot;&gt;422&lt;span style=\&quot;color:#FFF\&quot;&gt;,&lt;br/&gt;    originalLine: &lt;span style=\&quot;color:#A50\&quot;&gt;2&lt;span style=\&quot;color:#FFF\&quot;&gt;,&lt;br/&gt;    originalColumn: &lt;span style=\&quot;color:#A50\&quot;&gt;32076&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;  },&lt;br/&gt;  code: &lt;span style=\&quot;color:#0A0\&quot;&gt;&#x27;VALIDATION&#x27;&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;}&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&quot;"></span></code></pre></div>

:::


### Internal server error
This happens when your application code explicitly throws a new `InternalServerError`.

- Status: 422 Unprocessable Entity
- Error class: `ValidationError`
- Code: `VALIDATION`

::: details Example request: `GET /crash/internal`

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- http://localhost:3000/crash/internal 
```

</div>

```http
HTTP/1.1 500 Internal Server Error
content-type: text/plain;charset=utf-8
Date: Mon, 23 Dec 2024 18:49:21 GMT
Content-Length: 21

Something went wrong!
```

<div style="margin-top: 0.5rem" class="language-ansi"><span class="lang">console output</span><pre style="background: black"><code style="color: white"><span v-html="&quot;[onError] {&lt;br/&gt;  error: InternalServerError: Something went wrong!&lt;br/&gt;      at new InternalServerError &lt;span style=\&quot;color:#555\&quot;&gt;(/Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;node_modules/&lt;u&gt;elysia&lt;/u&gt;/src/error.ts:68:3&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at &lt;anonymous&gt; &lt;span style=\&quot;color:#555\&quot;&gt;(/Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;examples/errors/built-in.example.ts:8:15&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at &lt;anonymous&gt; &lt;span style=\&quot;color:#555\&quot;&gt;(/Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;examples/errors/built-in.example.ts:7:27&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at &lt;anonymous&gt; &lt;span style=\&quot;color:#555\&quot;&gt;(file:///Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;node_modules/&lt;u&gt;elysia&lt;/u&gt;/dist/bun/index.js:5:76&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at handle &lt;span style=\&quot;color:#555\&quot;&gt;(file:///Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;node_modules/&lt;u&gt;elysia&lt;/u&gt;/dist/bun/index.js:5:80&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at map &lt;span style=\&quot;color:#555\&quot;&gt;(file:///Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;node_modules/&lt;u&gt;elysia&lt;/u&gt;/dist/bun/index.js:20:95&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at &lt;anonymous&gt; &lt;span style=\&quot;color:#555\&quot;&gt;(/Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;index.ts:222:26&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at fetch &lt;span style=\&quot;color:#555\&quot;&gt;(/Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;index.ts:221:21&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt; {&lt;br/&gt;    code: &lt;span style=\&quot;color:#0A0\&quot;&gt;&#x27;INTERNAL_SERVER_ERROR&#x27;&lt;span style=\&quot;color:#FFF\&quot;&gt;,&lt;br/&gt;    status: &lt;span style=\&quot;color:#A50\&quot;&gt;500&lt;span style=\&quot;color:#FFF\&quot;&gt;,&lt;br/&gt;    originalLine: &lt;span style=\&quot;color:#A50\&quot;&gt;2&lt;span style=\&quot;color:#FFF\&quot;&gt;,&lt;br/&gt;    originalColumn: &lt;span style=\&quot;color:#A50\&quot;&gt;29320&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;  },&lt;br/&gt;  code: &lt;span style=\&quot;color:#0A0\&quot;&gt;&#x27;INTERNAL_SERVER_ERROR&#x27;&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;}&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&quot;"></span></code></pre></div>

:::


### Unknown error
This happens when your application code throws an error that is not any of the built-in Elysia errors.

- Status: 500 Internal Server Error
- Code: `UNKNOWN`

::: details Example request: `GET /crash/error`

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- http://localhost:3000/crash/error 
```

</div>

```http
HTTP/1.1 500 Internal Server Error
content-type: text/plain;charset=utf-8
Date: Mon, 23 Dec 2024 18:49:21 GMT
Content-Length: 50

{"name":"Error","message":"Something went wrong!"}
```

<div style="margin-top: 0.5rem" class="language-ansi"><span class="lang">console output</span><pre style="background: black"><code style="color: white"><span v-html="&quot;[onError] {&lt;br/&gt;  error: Error: Something went wrong!&lt;br/&gt;      at &lt;anonymous&gt; &lt;span style=\&quot;color:#555\&quot;&gt;(/Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;examples/errors/built-in.example.ts:11:15&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at &lt;anonymous&gt; &lt;span style=\&quot;color:#555\&quot;&gt;(/Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;examples/errors/built-in.example.ts:10:24&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at &lt;anonymous&gt; &lt;span style=\&quot;color:#555\&quot;&gt;(file:///Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;node_modules/&lt;u&gt;elysia&lt;/u&gt;/dist/bun/index.js:5:76&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at handle &lt;span style=\&quot;color:#555\&quot;&gt;(file:///Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;node_modules/&lt;u&gt;elysia&lt;/u&gt;/dist/bun/index.js:5:80&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at map &lt;span style=\&quot;color:#555\&quot;&gt;(file:///Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;node_modules/&lt;u&gt;elysia&lt;/u&gt;/dist/bun/index.js:22:108&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at &lt;anonymous&gt; &lt;span style=\&quot;color:#555\&quot;&gt;(/Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;index.ts:222:26&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;      at fetch &lt;span style=\&quot;color:#555\&quot;&gt;(/Users/dtinth/Projects/elysia-by-example/&lt;span style=\&quot;color:#FFF\&quot;&gt;index.ts:221:21&lt;span style=\&quot;color:#555\&quot;&gt;)&lt;span style=\&quot;color:#FFF\&quot;&gt; {&lt;br/&gt;    originalLine: &lt;span style=\&quot;color:#A50\&quot;&gt;7&lt;span style=\&quot;color:#FFF\&quot;&gt;,&lt;br/&gt;    originalColumn: &lt;span style=\&quot;color:#A50\&quot;&gt;18&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;  },&lt;br/&gt;  code: &lt;span style=\&quot;color:#0A0\&quot;&gt;&#x27;UNKNOWN&#x27;&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;br/&gt;}&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&lt;/span&gt;&quot;"></span></code></pre></div>

:::

## The `error` function
You can call the `error` function to generate an error response (an instance of `ElysiaCustomStatusResponse`), which should then be returned.
```ts
// examples/errors/custom-status-response.example.ts
import { Elysia } from "elysia";
export default new Elysia()
  .onError(({ code }) => {
    console.log("[onError]", code);
  })
  .get("/return", async ({ error }) => {
    return error("I'm a teapot", { message: "meow!" });
  })
  .get("/throw", async ({ error }) => {
    // INCORRECT: Do NOT throw an instance of `ElysiaCustomStatusResponse`.
    throw error("I'm a teapot", { message: "meow!" });
  });

```


As the error object is returned, the `onError` hook is NOT called.

::: details Example request: `GET /return`

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- http://localhost:3000/return 
```

</div>

```http
HTTP/1.1 418 I'm a Teapot
Content-Type: application/json;charset=utf-8
Date: Mon, 23 Dec 2024 18:49:21 GMT
Content-Length: 19

{"message":"meow!"}
```
:::


As `ElysiaCustomStatusResponse` is not an instance of `Error`, you should not `throw` it.
Otherwise, the response body will not be formatted correctly.

::: details Example request: `GET /throw`

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- http://localhost:3000/throw 
```

</div>

```http
HTTP/1.1 418 I'm a Teapot
content-type: text/plain;charset=utf-8
Date: Mon, 23 Dec 2024 18:49:21 GMT
Content-Length: 15

[object Object]
```

<div style="margin-top: 0.5rem" class="language-ansi"><span class="lang">console output</span><pre style="background: black"><code style="color: white"><span v-html="&quot;[onError] &lt;span style=\&quot;color:#A50\&quot;&gt;418&lt;span style=\&quot;color:#FFF\&quot;&gt;&lt;/span&gt;&lt;/span&gt;&quot;"></span></code></pre></div>

:::
