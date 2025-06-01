# response-string

## Example Code

```typescript
import { Elysia } from "elysia";
export default new Elysia().get("/string", async () => "hi");


```

## Tests

### test

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/string"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:23:53 GMT
Content-Length: 2

hi

```

```text [node]
=== Runtime Output ===
(node:27) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/string"
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 2
Date: Sun, 01 Jun 2025 06:23:54 GMT
Connection: keep-alive
Keep-Alive: timeout=5

hi

```

:::
