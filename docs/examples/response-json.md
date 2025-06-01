# response-json

## Example Code

```typescript
import { Elysia } from "elysia";
export default new Elysia().get("/json", async () => {
  return { ok: true };
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
$ curl -s -D- "http://localhost:3000/json"
HTTP/1.1 200 OK
Content-Type: application/json
Date: Sun, 01 Jun 2025 06:24:25 GMT
Content-Length: 11

{"ok":true}

```

```text [node]
=== Runtime Output ===
(node:28) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/json"
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 11
Date: Sun, 01 Jun 2025 06:24:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"ok":true}

```

:::
