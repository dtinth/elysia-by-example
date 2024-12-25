<!-- This file is automatically-generated. Do not edit. -->

<template v-if="false">

> [!CAUTION]
> This file has been automatically generated from the [examples in the `examples/body-parsing` directory.](https://github.com/dtinth/elysia-by-example/tree/main/examples/body-parsing).
> Do not directly edit this file, as it will be overwritten.
> [[View the live site here.]](https://dtinth.github.io/elysia-by-example/examples/body-parsing.html)

</template>


# Body Parsing
By default, Elysia is able to parse request body of various formats.

```ts
// examples/body-parsing/builtin.example.ts
import { Elysia } from "elysia";
export default new Elysia().post("/parse", async ({ body }) => {
  return Bun.inspect(body);
});

```

## Built-in
### JSON
**Mime type:** `application/json`


::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/parse" -X POST \
  -H "Content-Type: application/json" \
  -d '{"x":1,"a":[2,3],"o":{"b":{"j":"k"}}}'
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:44 GMT
Content-Length: 68

{
  x: 1,
  a: [ 2, 3 ],
  o: {
    b: {
      j: "k",
    },
  },
}
```
:::


### URL-encoded form
Mime type: `application/x-www-form-urlencoded`

Elysia doesn’t automatically convert numeric strings to numbers by default.

::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/parse" -X POST \
  -d x=1 -d y=2 -d z=3
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:44 GMT
Content-Length: 33

{
  x: "1",
  y: "2",
  z: "3",
}
```
:::


Elysia doesn’t support PHP-style nested arrays in URL-encoded forms.

::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/parse" -X POST \
  -d o[b][j]=k -d a[]=1
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:44 GMT
Content-Length: 35

{
  "o[b][j]": "k",
  "a[]": "1",
}
```
:::


However, upon receiving a duplicate key, Elysia will return an array of values.

::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/parse" -X POST \
  -d a=foo -d a=bar -d a=baz
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:44 GMT
Content-Length: 33

{
  a: [ "foo", "bar", "baz" ],
}
```
:::


### Multipart form
Mime type: `multipart/form-data`

Same parsing logic as URL-encoded form.

::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/parse" -X POST \
  -F x=1 -F y=2 -F z=3 \
  -F a=foo -F a=bar -F a=baz
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:44 GMT
Content-Length: 63

{
  x: "1",
  y: "2",
  z: "3",
  a: [ "foo", "bar", "baz" ],
}
```
:::


File uploads are supported.

::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/parse" -X POST \
  -F file=@package.json
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:44 GMT
Content-Length: 102

{
  file: File (0.85 KB) {
    name: "package.json",
    type: "application/json;charset=utf-8"
  },
}
```
:::


Multiple file uploads are supported.

::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/parse" -X POST \
  -F file=@package.json \
  -F file=@tsconfig.json
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:44 GMT
Content-Length: 217

{
  file: [
    File (0.85 KB) {
      name: "package.json",
      type: "application/json;charset=utf-8"
    }, File (45 bytes) {
      name: "tsconfig.json",
      type: "application/json;charset=utf-8"
    }
  ],
}
```
:::


### Plain text
Mime type: `text/plain`

::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/parse" -X POST \
  -H "Content-Type: text/plain" \
  -d "hello, world"
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:45 GMT
Content-Length: 14

"hello, world"
```
:::


### Binary data
Mime type: `application/octet-stream`

When the content type is `application/octet-stream`, Elysia will provide an `ArrayBuffer` object in the `body` context.

::: details Example request

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/parse" -X POST \
  -H "Content-Type: application/octet-stream" \
  -d "hello, world"
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:45 GMT
Content-Length: 76

ArrayBuffer(12) [ 104, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100 ]
```
:::


### Unknown type
When a type is unknown to Elysia, the raw body will be `undefined`.


::: details Example request: application/xml

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/parse" -X POST \
  -H "Content-Type: application/xml" \
  -d "<hello>world</hello>" 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:45 GMT
Content-Length: 9

undefined
```
:::



::: details Example request: application/x-ndjson

<div style="margin-bottom: 0.5rem">

```sh
curl -s -D- "http://localhost:3000/parse" -X POST \
  -H "Content-Type: application/x-ndjson" \
  -d $'{"hello":"world"}\n{"foo":"bar"}\n' 
```

</div>

```http
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Wed, 25 Dec 2024 09:38:45 GMT
Content-Length: 9

undefined
```
:::
