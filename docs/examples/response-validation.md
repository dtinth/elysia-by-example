# response-validation

## Example Code

```typescript
import { Elysia, t } from "elysia";
export default new Elysia().get(
  "/",
  async () => {
    return { a: 1, b: 2 };
  },
  { response: t.Object({ a: t.Number() }) }
);


```

## Tests

| Test | bun | node |
| --- | --- | --- |
| [test](#test) | ✅ | ✅ |

### test

::: code-group

```text [bun]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000/"
HTTP/1.1 200 OK
Content-Type: application/json
Date: Sun, 01 Jun 2025 06:24:24 GMT
Content-Length: 7

{"a":1}
✓ expect: 200
✓ expect-not: b

=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

```

```text [node]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000/"
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 7
Date: Sun, 01 Jun 2025 06:24:25 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"a":1}
✓ expect: 200
✓ expect-not: b

=== Runtime Output ===
(node:27) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

```

:::
