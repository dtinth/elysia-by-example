# smallest

## Example Code

```typescript
import { Elysia } from "elysia";
export default new Elysia();


```

## Tests

| Test | bun | node |
| --- | --- | --- |
| [test](#test) | 🏃 | 🏃 |

### test

::: code-group

```text [bun]
=== Test Execution ===
$ curl -s -D- http://localhost:3000
HTTP/1.1 404 Not Found
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:24 GMT
Content-Length: 9

NOT_FOUND

=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

```

```text [node]
=== Test Execution ===
$ curl -s -D- http://localhost:3000
HTTP/1.1 404 Not Found
content-type: text/plain;charset=UTF-8
content-length: 9
Date: Sun, 01 Jun 2025 06:24:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

NOT_FOUND

=== Runtime Output ===
(node:28) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

```

:::
