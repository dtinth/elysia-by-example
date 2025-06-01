# hook-log

## Example Code

```typescript
// ## Available context properties inside each hook
import { Elysia, t } from "elysia";

const logContext = (name: string, context: any) => {
  console.log(
    `[${name}]`.padEnd(17),
    `{ ${Object.keys(context).sort().join(", ")} }`
  );
};

export default new Elysia()
  .onRequest((context) => logContext("onRequest", context))
  .onParse((context) => logContext("onParse", context))
  .onTransform((context) => logContext("onTransform", context))
  .onBeforeHandle((context) => logContext("onBeforeHandle", context))
  .onAfterHandle((context) => logContext("onAfterHandle", context))
  .mapResponse((context) => logContext("mapResponse", context))
  .onAfterResponse((context) => logContext("onAfterResponse", context))
  .onError((context) => logContext("onError", context))
  .post(
    "/",
    async (context) => {
      logContext("handler", context);
      if (context.query["crash"]) throw new Error("crash");
      return { ok: true };
    },
    {
      query: t.Object({
        crash: t.Optional(t.String()),
        validate: t.Optional(t.Literal("pass")),
      }),
    }
  );




```

## Tests

| Test | bun | node |
| --- | --- | --- |
| [200](#200) | 🏃 | 🏃 |
| [422](#422) | 🏃 | 🏃 |
| [500](#500) | 🏃 | 🏃 |

### 200

::: code-group

```text [bun]
=== Test Execution ===
$ curl -s -D- http://localhost:3000 -X POST -d x=1
HTTP/1.1 200 OK
Content-Type: application/json
Date: Sun, 01 Jun 2025 06:24:12 GMT
Content-Length: 11

{"ok":true}

=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000
[onRequest]       { error, path, qi, redirect, request, server, set, status, store, url }
[onParse]         { contentType, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[onTransform]     { body, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[onBeforeHandle]  { body, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[handler]         { body, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[onAfterHandle]   { body, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, status, store, url }
[mapResponse]     { body, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, status, store, url }
[onAfterResponse] { body, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, status, store, url }

```

```text [node]
=== Test Execution ===
$ curl -s -D- http://localhost:3000 -X POST -d x=1
HTTP/1.1 200 OK
content-type: application/json
Content-Length: 11
Date: Sun, 01 Jun 2025 06:24:13 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"ok":true}

=== Runtime Output ===
(node:27) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000
[onRequest]       { error, path, qi, redirect, request, server, set, status, store, url }
[onParse]         { contentType, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[onTransform]     { body, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[onBeforeHandle]  { body, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[handler]         { body, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[onAfterHandle]   { body, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, status, store, url }
[mapResponse]     { body, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, status, store, url }
[onAfterResponse] { body, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, status, store, url }

```

:::

### 422

::: code-group

```text [bun]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000?validate=fail" -X POST -d x=1
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json
Date: Sun, 01 Jun 2025 06:24:13 GMT
Content-Length: 460

{
  "type": "validation",
  "on": "query",
  "summary": "Expected 'pass'",
  "property": "/validate",
  "message": "Expected 'pass'",
  "expected": {},
  "found": {
    "validate": "fail"
  },
  "errors": [
    {
      "summary": "Expected 'pass'",
      "type": 32,
      "schema": {
        "const": "pass",
        "type": "string"
      },
      "path": "/validate",
      "value": "fail",
      "message": "Expected 'pass'",
      "errors": []
    }
  ]
}

=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000
[onRequest]       { error, path, qi, redirect, request, server, set, status, store, url }
[onParse]         { contentType, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[onTransform]     { body, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[onError]         { body, code, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[mapResponse]     { body, code, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, status, store, url }
[onAfterResponse] { body, code, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, status, store, url }

```

```text [node]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000?validate=fail" -X POST -d x=1
HTTP/1.1 400 Bad Request
content-type: application/json
Content-Length: 460
Date: Sun, 01 Jun 2025 06:24:14 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "validation",
  "on": "query",
  "summary": "Expected 'pass'",
  "property": "/validate",
  "message": "Expected 'pass'",
  "expected": {},
  "found": {
    "validate": "fail"
  },
  "errors": [
    {
      "summary": "Expected 'pass'",
      "type": 32,
      "schema": {
        "const": "pass",
        "type": "string"
      },
      "path": "/validate",
      "value": "fail",
      "message": "Expected 'pass'",
      "errors": []
    }
  ]
}

=== Runtime Output ===
(node:27) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000
[onRequest]       { error, path, qi, redirect, request, server, set, status, store, url }
[onParse]         { contentType, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[onTransform]     { body, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[onError]         { body, code, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[mapResponse]     { body, code, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, status, store, url }
[onError]         { body, code, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, status, store, url }
[mapResponse]     { body, code, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, status, store, url }
[onAfterResponse] { body, code, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, status, store, url }

```

:::

### 500

::: code-group

```text [bun]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000?crash=1" -X POST -d x=1
HTTP/1.1 500 Internal Server Error
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:13 GMT
Content-Length: 5

crash

=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000
[onRequest]       { error, path, qi, redirect, request, server, set, status, store, url }
[onParse]         { contentType, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[onTransform]     { body, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[onBeforeHandle]  { body, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[handler]         { body, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[onError]         { body, code, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[mapResponse]     { body, code, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, status, store, url }
[onAfterResponse] { body, code, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, status, store, url }

```

```text [node]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000?crash=1" -X POST -d x=1
HTTP/1.1 500 Internal Server Error
Content-Length: 5
Date: Sun, 01 Jun 2025 06:24:15 GMT
Connection: keep-alive
Keep-Alive: timeout=5

crash

=== Runtime Output ===
(node:28) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000
[onRequest]       { error, path, qi, redirect, request, server, set, status, store, url }
[onParse]         { contentType, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[onTransform]     { body, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[onBeforeHandle]  { body, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[handler]         { body, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[onError]         { body, code, cookie, error, headers, path, qi, query, redirect, request, route, server, set, status, store, url }
[mapResponse]     { body, code, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, status, store, url }
[onError]         { body, code, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, status, store, url }
[mapResponse]     { body, code, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, status, store, url }
[onAfterResponse] { body, code, cookie, error, headers, path, qi, query, redirect, request, response, route, server, set, status, store, url }

```

:::
