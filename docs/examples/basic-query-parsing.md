# basic-query-parsing

## Example Code

```typescript
import { Elysia } from "elysia";
export default new Elysia()
  .get("/", async () => {
    return "it is working!";
  })
  .get("/greeting", async ({ query }) => {
    const name = query["name"] || "world"; // [!code highlight]
    return `hello ${name}`;
  });



```

## Tests

### greeting_without_query

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/greeting"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:23:46 GMT
Content-Length: 11

hello world
✓ expect: 200
✓ expect: hello world

```

```text [node]
=== Runtime Output ===
(node:28) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/greeting"
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 11
Date: Sun, 01 Jun 2025 06:23:47 GMT
Connection: keep-alive
Keep-Alive: timeout=5

hello world
✓ expect: 200
✓ expect: hello world

```

:::

### greeting_with_query

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/greeting?name=alice"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:23:46 GMT
Content-Length: 11

hello alice
✓ expect: 200
✓ expect: hello alice

```

```text [node]
=== Runtime Output ===
(node:26) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/greeting?name=alice"
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 11
Date: Sun, 01 Jun 2025 06:23:47 GMT
Connection: keep-alive
Keep-Alive: timeout=5

hello alice
✓ expect: 200
✓ expect: hello alice

```

:::
