# body-parsing

## Example Code

```typescript
import { Elysia } from "elysia";
export default new Elysia().post("/parse", async ({ body }) => {
  return Bun.inspect(body);
});

//    -H "Content-Type: application/json" \
//    -d '{"x":1,"a":[2,3],"o":{"b":{"j":"k"}}}'

//    -d x=1 -d y=2 -d z=3

//    -d o[b][j]=k -d a[]=1

//    -d a=foo -d a=bar -d a=baz

//    -F x=1 -F y=2 -F z=3 \
//    -F a=foo -F a=bar -F a=baz

//    -F file=@package.json

//    -F file=@package.json \
//    -F file=@tsconfig.json

//    -H "Content-Type: text/plain" \
//    -d "hello, world"

//    -H "Content-Type: application/octet-stream" \
//    -d "hello, world"

//    -H "Content-Type: application/xml" \
//    -d "<hello>world</hello>"

//    -H "Content-Type: application/x-ndjson" \
//    -d $'{"hello":"world"}\n{"foo":"bar"}\n'

```

## Tests

### json

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -H "Content-Type: application/json" \
  -d '{"x":1,"a":[2,3],"o":{"b":{"j":"k"}}}'
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:23:54 GMT
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
✓ expect: 200
✓ expect: a: [ 2, 3 ]

```

```text [node]
=== Runtime Output ===
(node:27) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -H "Content-Type: application/json" \
  -d '{"x":1,"a":[2,3],"o":{"b":{"j":"k"}}}'
HTTP/1.1 500 Internal Server Error
Content-Length: 18
Date: Sun, 01 Jun 2025 06:23:55 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Bun is not defined
✗ expect: 200

=== Error ===
Expected "200" but got: "HTTP/1.1 500 Internal Server Error
Content-Length: 18
Date: Sun, 01 Jun 2025 06:23:55 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Bun is not defined"

```

:::

### urlencoded

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -d x=1 -d y=2 -d z=3
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:23:55 GMT
Content-Length: 58

[Object: null prototype] {
  x: "1",
  y: "2",
  z: "3",
}

```

```text [node]
=== Runtime Output ===
(node:27) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -d x=1 -d y=2 -d z=3
HTTP/1.1 500 Internal Server Error
Content-Length: 18
Date: Sun, 01 Jun 2025 06:23:56 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Bun is not defined

```

:::

### urlencoded_php_arrays_are_unsupported

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -d o[b][j]=k -d a[]=1
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:23:56 GMT
Content-Length: 60

[Object: null prototype] {
  "o[b][j]": "k",
  "a[]": "1",
}

```

```text [node]
=== Runtime Output ===
(node:28) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -d o[b][j]=k -d a[]=1
HTTP/1.1 500 Internal Server Error
Content-Length: 18
Date: Sun, 01 Jun 2025 06:23:57 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Bun is not defined

```

:::

### urlencoded_duplicate_keys_become_array

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -d a=foo -d a=bar -d a=baz
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:23:56 GMT
Content-Length: 58

[Object: null prototype] {
  a: [ "foo", "bar", "baz" ],
}

```

```text [node]
=== Runtime Output ===
(node:28) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -d a=foo -d a=bar -d a=baz
HTTP/1.1 500 Internal Server Error
Content-Length: 18
Date: Sun, 01 Jun 2025 06:23:57 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Bun is not defined

```

:::

### multipart

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -F x=1 -F y=2 -F z=3 \
  -F a=foo -F a=bar -F a=baz
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:23:57 GMT
Content-Length: 63

{
  x: "1",
  y: "2",
  z: "3",
  a: [ "foo", "bar", "baz" ],
}

```

```text [node]
=== Runtime Output ===
(node:27) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -F x=1 -F y=2 -F z=3 \
  -F a=foo -F a=bar -F a=baz
HTTP/1.1 500 Internal Server Error
Content-Length: 18
Date: Sun, 01 Jun 2025 06:23:58 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Bun is not defined

```

:::

### file_upload

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -F file=@package.json
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:23:58 GMT
Content-Length: 101

{
  file: File (1.1 KB) {
    name: "package.json",
    type: "application/json;charset=utf-8"
  },
}

```

```text [node]
=== Runtime Output ===
(node:27) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -F file=@package.json
HTTP/1.1 500 Internal Server Error
Content-Length: 18
Date: Sun, 01 Jun 2025 06:23:59 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Bun is not defined

```

:::

### file_upload_multiple

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -F file=@package.json \
  -F file=@tsconfig.json
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:23:59 GMT
Content-Length: 216

{
  file: [
    File (1.1 KB) {
      name: "package.json",
      type: "application/json;charset=utf-8"
    }, File (45 bytes) {
      name: "tsconfig.json",
      type: "application/json;charset=utf-8"
    }
  ],
}

```

```text [node]
=== Runtime Output ===
(node:28) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -F file=@package.json \
  -F file=@tsconfig.json
HTTP/1.1 500 Internal Server Error
Content-Length: 18
Date: Sun, 01 Jun 2025 06:24:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Bun is not defined

```

:::

### plain_text

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -H "Content-Type: text/plain" \
  -d "hello, world"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:00 GMT
Content-Length: 14

"hello, world"

```

```text [node]
=== Runtime Output ===
(node:27) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -H "Content-Type: text/plain" \
  -d "hello, world"
HTTP/1.1 500 Internal Server Error
Content-Length: 18
Date: Sun, 01 Jun 2025 06:24:01 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Bun is not defined

```

:::

### octet_stream

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -H "Content-Type: application/octet-stream" \
  -d "hello, world"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:00 GMT
Content-Length: 76

ArrayBuffer(12) [ 104, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100 ]

```

```text [node]
=== Runtime Output ===
(node:28) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -H "Content-Type: application/octet-stream" \
  -d "hello, world"
HTTP/1.1 500 Internal Server Error
Content-Length: 18
Date: Sun, 01 Jun 2025 06:24:01 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Bun is not defined

```

:::

### xml_is_unsupported

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -H "Content-Type: application/xml" \
  -d "<hello>world</hello>"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:01 GMT
Content-Length: 58

[Object: null prototype] {
  "<hello>world</hello>": "",
}

```

```text [node]
=== Runtime Output ===
(node:27) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -H "Content-Type: application/xml" \
  -d "<hello>world</hello>"
HTTP/1.1 500 Internal Server Error
Content-Length: 18
Date: Sun, 01 Jun 2025 06:24:02 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Bun is not defined

```

:::

### ndjson_is_unsupported

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -H "Content-Type: application/x-ndjson" \
  -d $'{"hello":"world"}\n{"foo":"bar"}\n'
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:02 GMT
Content-Length: 80

[Object: null prototype] {
  "{\"hello\":\"world\"}\n{\"foo\":\"bar\"}\n": "",
}

```

```text [node]
=== Runtime Output ===
(node:28) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/parse" -X POST \
  -H "Content-Type: application/x-ndjson" \
  -d $'{"hello":"world"}\n{"foo":"bar"}\n'
HTTP/1.1 500 Internal Server Error
Content-Length: 18
Date: Sun, 01 Jun 2025 06:24:03 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Bun is not defined

```

:::
