# context

## Example Code

```typescript
import { Elysia } from "elysia";
export default new Elysia().get("/context", async (context) => {
  return Bun.inspect(context);
});


```

## Tests

### test

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/context"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:23 GMT
Content-Length: 647

{
  request: Request (0 KB) {
    method: "GET",
    url: "http://localhost:3000/context",
    headers: Headers {
      "host": "localhost:3000",
      "user-agent": "curl/7.88.1",
      "accept": "*/*",
    }
  },
  store: {},
  qi: -1,
  path: "/context",
  url: "http://localhost:3000/context",
  redirect: [Function: redirect],
  error: [Function: status],
  status: [Function: status],
  set: {
    headers: [Object: null prototype] {},
    status: 200,
    cookie: {},
  },
  server: [Getter],
  headers: {
    host: "localhost:3000",
    "user-agent": "curl/7.88.1",
    accept: "*/*",
  },
  cookie: {},
  query: {},
  route: "/context",
}

```

```text [node]
=== Runtime Output ===
(node:27) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/context"
HTTP/1.1 500 Internal Server Error
Content-Length: 18
Date: Sun, 01 Jun 2025 06:24:24 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Bun is not defined

```

:::
