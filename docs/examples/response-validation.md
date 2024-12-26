<!-- This file is automatically-generated. Do not edit. -->

<template v-if="false">

> [!CAUTION]
> This file has been automatically generated from the [examples in the `examples/response-validation` directory.](https://github.com/dtinth/elysia-by-example/tree/main/examples/response-validation).
> Do not directly edit this file, as it will be overwritten.
> [[View the live site here.]](https://dtinth.github.io/elysia-by-example/examples/response-validation.html)

</template>


# Response Validation

If the route specifies a `response` schema, the response will be validated against it.


## Extraneous properties are removed
By default, Elysia will remove any extraneous properties from the response.

```ts
// examples/response-validation/extra-basic.example.ts
import { Elysia, t } from "elysia";
export default new Elysia().get(
  "/",
  async () => {
    return { a: 1, b: 2 };
  },
  { response: t.Object({ a: t.Number() }) },
);

```


::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/"
```

</div>

```http
HTTP/1.1 200 OK
Content-Type: application/json;charset=utf-8
Date: Thu, 26 Dec 2024 08:44:18 GMT
Content-Length: 7

{"a":1}
```
:::

### `additionalProperties` option
Specify `additionalProperties: true` to allow additional properties in the response object.

```ts
// examples/response-validation/extra-with-additional.example.ts
import { Elysia, t } from "elysia";
export default new Elysia().get(
  "/",
  async () => {
    return { a: 1, b: 2 };
  },
  { response: t.Object({ a: t.Number() }, { additionalProperties: true }) },
);

```


::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/"
```

</div>

```http
HTTP/1.1 200 OK
Content-Type: application/json;charset=utf-8
Date: Thu, 26 Dec 2024 08:44:18 GMT
Content-Length: 13

{"a":1,"b":2}
```
:::

## Failed validations result in 422
The response validation will fail if the response does not match the schema.
When this happens, Elysia will return a 422 Unprocessable Entity response.
The `onError` hook will be called with the error code of `VALIDATION`.

```ts
// examples/response-validation/fail.example.ts
import { Elysia, t } from "elysia";
export default new Elysia()
  .onError(({ code }) => {
    console.log("[onError]", code);
  })
  .get(
    "/",
    async () => {
      return { a: "x" as any };
    },
    { response: t.Object({ a: t.Number() }) },
  );

```


::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/"
```

</div>

```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json
Date: Thu, 26 Dec 2024 08:34:52 GMT
Content-Length: 425

{
  "type": "validation",
  "on": "response",
  "summary": "Expected number",
  "property": "/a",
  "message": "Expected number",
  "expected": {
    "a": 0
  },
  "found": {
    "a": "x"
  },
  "errors": [
    {
      "summary": "Expected number",
      "type": 41,
      "schema": {
        "type": "number"
      },
      "path": "/a",
      "value": "x",
      "message": "Expected number",
      "errors": []
    }
  ]
}
```

<div style="margin-top: 0.5rem" class="language-ansi"><span class="lang">console output</span><pre style="background: black"><code style="color: white"><span v-html="&quot;[onError] VALIDATION&quot;"></span></code></pre></div>

:::
