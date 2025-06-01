# issue-0859-bug1

## Example Code

```typescript
import Elysia, { t } from "elysia";
export default new Elysia().get(
  "/",
  async () => {
    // Bug: `b: 2` should be included in the response object, yet it is not.
    return { keys: [{ a: 1, b: 2 }], extra: true };
  },
  {
    response: t.Object({
      keys: t.Array(
        t.Object({ a: t.Number() }, { additionalProperties: true })
      ),
    }),
  }
);


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
HTTP/1.1 200 OK
Content-Type: application/json
Date: Sun, 01 Jun 2025 06:24:22 GMT
Content-Length: 24

{"keys":[{"a":1,"b":2}]}

=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

```

```text [node]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000"
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 24
Date: Sun, 01 Jun 2025 06:24:23 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"keys":[{"a":1,"b":2}]}

=== Runtime Output ===
(node:29) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

```

:::
