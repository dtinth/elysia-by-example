<!-- This file is automatically-generated. Do not edit. -->

<template v-if="false">

> [!CAUTION]
> This file has been automatically generated from the [examples in the `examples/bugs` directory.](https://github.com/dtinth/elysia-by-example/tree/main/examples/bugs).
> Do not directly edit this file, as it will be overwritten.
> [[View the live site here.]](https://dtinth.github.io/elysia-by-example/examples/bugs.html)

</template>


# Bugs

These are behaviors in Elysia that I consider bugs. [I have reported them.](https://github.com/elysiajs/elysia/issues?q=sort%3Aupdated-desc+is%3Aissue+author%3Adtinth)


## additionalProperties do not work in nested response objects ([#859](https://github.com/elysiajs/elysia/issues/859))

```ts
// examples/bugs/issue-0859-bug.example.ts
import Elysia, { t } from "elysia";
export default new Elysia().get(
  "/",
  async () => {
    return { keys: [{ a: 1, b: 2 }], extra: true };
  },
  {
    response: t.Object({
      keys: t.Array(
        t.Object({ a: t.Number() }, { additionalProperties: true }),
      ),
    }),
  },
);

```

In this example, the `b` property is **missing** from the response object, even though `additionalProperties` is set to `true` in the nested object schema.

::: details Example request: `GET /`

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000" 
```

</div>

```http
HTTP/1.1 200 OK
Content-Type: application/json;charset=utf-8
Date: Fri, 20 Dec 2024 14:21:37 GMT
Content-Length: 18

{"keys":[{"a":1}]}
```
:::

### Workaround: Specify `additionalProperties: true` in the top level response schema
It appears that `additionalProperties` has to be specified at the top level, and then it is applied throughout the entire schema.

```ts
// examples/bugs/issue-0859-workaround1.example.ts
import Elysia, { t } from "elysia";
export default new Elysia().get(
  "/",
  async () => {
    return { keys: [{ a: 1, b: 2 }], extra: true };
  },
  {
    response: t.Object(
      { keys: t.Array(t.Object({ a: t.Number() })) },
      { additionalProperties: true },
    ),
  },
);

```

This somewhat solves the problem in that the `b` property is now **present** in the response object.
But we also get the `extra` property, which we did not expect.

::: details Example request: `GET /`

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000" 
```

</div>

```http
HTTP/1.1 200 OK
Content-Type: application/json;charset=utf-8
Date: Fri, 20 Dec 2024 14:21:37 GMT
Content-Length: 37

{"keys":[{"a":1,"b":2}],"extra":true}
```
:::

Furthermore, we are breaking away from the JSON Schema specification.
According to the specification, the nested object should not have the `b` property, yet it is still returned in the response.
This could become problematic when integrating with other systems that rely on the JSON Schema specification.