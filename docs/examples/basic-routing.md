# basic-routing

## Example Code

```typescript
import { Elysia } from "elysia";
export default new Elysia()
  .get("/", async ({ request }) => {
    return new Response("it is working!", { status: 200 });
  })
  .get("/greeting", async ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get("name") || "world";
    const greeting = `hello ${name}`;
    return new Response(greeting, { status: 200 });
  });





```

## Tests

| Test | bun | node |
| --- | --- | --- |
| [root](#root) | ✅ | ✅ |
| [greeting_without_query](#greeting_without_query) | ✅ | ✅ |
| [greeting_with_query](#greeting_with_query) | ✅ | ✅ |
| [404](#404) | ✅ | ✅ |

### root

::: code-group

```text [bun]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:08 GMT
Content-Length: 14

it is working!
✓ expect: 200
✓ expect: it is working!

=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

```

```text [node]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000"
HTTP/1.1 200 OK
content-type: text/plain; charset=UTF-8
Content-Length: 14
Date: Sun, 01 Jun 2025 06:24:09 GMT
Connection: keep-alive
Keep-Alive: timeout=5

it is working!
✓ expect: 200
✓ expect: it is working!

=== Runtime Output ===
(node:28) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

```

:::

### greeting_without_query

::: code-group

```text [bun]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000/greeting"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:09 GMT
Content-Length: 11

hello world
✓ expect: 200
✓ expect: hello world

=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

```

```text [node]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000/greeting"
HTTP/1.1 200 OK
content-type: text/plain; charset=UTF-8
Content-Length: 11
Date: Sun, 01 Jun 2025 06:24:10 GMT
Connection: keep-alive
Keep-Alive: timeout=5

hello world
✓ expect: 200
✓ expect: hello world

=== Runtime Output ===
(node:26) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

```

:::

### greeting_with_query

::: code-group

```text [bun]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000/greeting?name=alice"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:10 GMT
Content-Length: 11

hello alice
✓ expect: 200
✓ expect: hello alice

=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

```

```text [node]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000/greeting?name=alice"
HTTP/1.1 200 OK
content-type: text/plain; charset=UTF-8
Content-Length: 11
Date: Sun, 01 Jun 2025 06:24:11 GMT
Connection: keep-alive
Keep-Alive: timeout=5

hello alice
✓ expect: 200
✓ expect: hello alice

=== Runtime Output ===
(node:28) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

```

:::

### 404

::: code-group

```text [bun]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000/nonexistent"
HTTP/1.1 404 Not Found
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:10 GMT
Content-Length: 9

NOT_FOUND
✓ expect: 404

=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

```

```text [node]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000/nonexistent"
HTTP/1.1 404 Not Found
content-type: text/plain;charset=UTF-8
content-length: 9
Date: Sun, 01 Jun 2025 06:24:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5

NOT_FOUND
✓ expect: 404

=== Runtime Output ===
(node:27) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

```

:::
