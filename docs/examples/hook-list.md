# hook-list

## Example Code

```typescript
import Elysia from "elysia";

const hookNames: string[] = [];
const app = new Elysia().get("/", () => hookNames);
for (const [eventName, handlers] of Object.entries(app.event)) {
  if (Array.isArray(handlers)) hookNames.push(eventName);
}

export default app;


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
HTTP/1.1 200 OK
Content-Type: application/json
Date: Sun, 01 Jun 2025 06:24:16 GMT
Content-Length: 2

[]

=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

```

```text [node]
=== Test Execution ===
$ curl -s -D- http://localhost:3000
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 2
Date: Sun, 01 Jun 2025 06:24:17 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[]

=== Runtime Output ===
(node:28) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

```

:::
