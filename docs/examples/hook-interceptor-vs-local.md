# hook-interceptor-vs-local

## Example Code

```typescript
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

## Tests

### a

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000
[interceptor] onRequest

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/a"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:02 GMT
Content-Length: 1

a

```

```text [node]
=== Runtime Output ===
(node:28) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000
[interceptor] onRequest

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/a"
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 1
Date: Sun, 01 Jun 2025 06:24:04 GMT
Connection: keep-alive
Keep-Alive: timeout=5

a

```

:::

### b

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000
[interceptor] onRequest
[interceptor] onBeforeHandle
[local] onBeforeHandle

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/b"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:04 GMT
Content-Length: 1

b

```

```text [node]
=== Runtime Output ===
(node:27) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000
[interceptor] onRequest
[interceptor] onBeforeHandle
[local] onBeforeHandle

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/b"
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 1
Date: Sun, 01 Jun 2025 06:24:04 GMT
Connection: keep-alive
Keep-Alive: timeout=5

b

```

:::

### c

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000
[interceptor] onRequest
[interceptor] onBeforeHandle

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/c"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:04 GMT
Content-Length: 1

c

```

```text [node]
=== Runtime Output ===
(node:27) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000
[interceptor] onRequest
[interceptor] onBeforeHandle

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/c"
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 1
Date: Sun, 01 Jun 2025 06:24:06 GMT
Connection: keep-alive
Keep-Alive: timeout=5

c

```

:::
