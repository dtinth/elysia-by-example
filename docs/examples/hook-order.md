# hook-order

## Example Code

```typescript
import { Elysia } from "elysia";

export default new Elysia()
  .get("/a", () => "a")
  .onBeforeHandle(() => console.log("onBeforeHandle called"))
  .get("/b", () => "b");



```

## Tests

| Test | bun | node |
| --- | --- | --- |
| [a](#a) | 🏃 | 🏃 |
| [b](#b) | 🏃 | 🏃 |

### a

::: code-group

```text [bun]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000/a"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:07 GMT
Content-Length: 1

a

=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

```

```text [node]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000/a"
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 1
Date: Sun, 01 Jun 2025 06:24:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

a

=== Runtime Output ===
(node:28) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

```

:::

### b

::: code-group

```text [bun]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000/b"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:07 GMT
Content-Length: 1

b

=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000
onBeforeHandle called

```

```text [node]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000/b"
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 1
Date: Sun, 01 Jun 2025 06:24:09 GMT
Connection: keep-alive
Keep-Alive: timeout=5

b

=== Runtime Output ===
(node:26) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000
onBeforeHandle called

```

:::
