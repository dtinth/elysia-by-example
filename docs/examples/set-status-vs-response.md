# set-status-vs-response

## Example Code

```typescript
import { Elysia } from "elysia";
export default new Elysia().get("/", async ({ set }) => {
  set.status = "Conflict";
  return new Response("hi", { status: 402 });
});


```

## Tests

| Test | bun | node |
| --- | --- | --- |
| [test](#test) | 🏃 | 🏃 |

### test

::: code-group

```text [bun]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000"
HTTP/1.1 409 Conflict
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:15 GMT
Content-Length: 2

hi

=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

```

```text [node]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000"
HTTP/1.1 409 Conflict
content-type: text/plain;charset=UTF-8
Content-Length: 2
Date: Sun, 01 Jun 2025 06:24:17 GMT
Connection: keep-alive
Keep-Alive: timeout=5

hi

=== Runtime Output ===
(node:27) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

```

:::
