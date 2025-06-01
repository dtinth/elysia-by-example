# errors-built-in

## Example Code

```typescript
import { Elysia, InternalServerError, t } from "elysia";
export default new Elysia()
  .onError(({ error, code }) => {
    console.log("[onError]", { error, code });
  })
  .get("/crash/internal", async () => {
    throw new InternalServerError("Something went wrong!");
  })
  .get("/crash/error", async () => {
    throw new Error("Something went wrong!");
  })
  .post("/body", async ({ body }) => ({ body }))
  .get("/validate", async () => "Validation passed", {
    query: t.Object({ name: t.String() }),
  })
  .get("/cookie", async ({ cookie }) => cookie.name.value, {
    cookie: t.Cookie(
      { name: t.String() },
      { secrets: "something", sign: ["name"] }
    ),
  });







```

## Tests

### 404

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000
[onError] {
  error: error: NOT_FOUND
 status: 404,
   code: "NOT_FOUND"

      at NotFoundError (/app/node_modules/elysia/src/error.ts:87:3)
,
  code: "NOT_FOUND",
}

=== Test Execution ===
$ curl -s -D- http://localhost:3000/nonexistent
HTTP/1.1 404 Not Found
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:18 GMT
Content-Length: 9

NOT_FOUND
✓ expect: 404
✓ expect-not: 200

```

```text [node]
=== Runtime Output ===
(node:28) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

=== Test Execution ===
$ curl -s -D- http://localhost:3000/nonexistent
HTTP/1.1 404 Not Found
content-type: text/plain;charset=UTF-8
content-length: 9
Date: Sun, 01 Jun 2025 06:24:18 GMT
Connection: keep-alive
Keep-Alive: timeout=5

NOT_FOUND
✓ expect: 404
✓ expect-not: 200

```

:::

### parse_error

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000
[onError] {
  error: 91 | export class ParseError extends Error {
92 | 	code = 'PARSE'
93 | 	status = 400
94 | 
95 | 	constructor(cause?: Error) {
96 | 		super('Bad Request', {
       ^
error: Bad Request
 status: 400,
   code: "PARSE"

      at new ParseError (/app/node_modules/elysia/src/error.ts:96:3)
      at handle (file:///app/node_modules/elysia/dist/bun/index.js:25:22)

SyntaxError: Failed to parse JSON
,
  code: "PARSE",
}

=== Test Execution ===
$ curl -s -D- http://localhost:3000/body -X POST -H "Content-Type: application/json" -d '{'
HTTP/1.1 400 Bad Request
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:18 GMT
Content-Length: 11

Bad Request

```

```text [node]
=== Runtime Output ===
(node:27) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000
[onError] {
  error: ParseError: Bad Request
      at handle (eval at composeHandler (file:///app/node_modules/elysia/dist/index.mjs:4451:12), <anonymous>:25:22)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async responseViaResponseObject (file:///app/node_modules/@hono/node-server/dist/index.mjs:370:13)
      at async Server.<anonymous> (file:///app/node_modules/@hono/node-server/dist/index.mjs:446:14) {
    code: 'PARSE',
    status: 400,
    [cause]: SyntaxError: Expected property name or '}' in JSON at position 1 (line 1 column 2)
        at JSON.parse (<anonymous>)
        at parseJSONFromBytes (node:internal/deps/undici/undici:5738:19)
        at successSteps (node:internal/deps/undici/undici:5719:27)
        at fullyReadBody (node:internal/deps/undici/undici:4609:9)
        at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
        at async consumeBody (node:internal/deps/undici/undici:5728:7)
        at async handle (eval at composeHandler (file:///app/node_modules/elysia/dist/index.mjs:4451:12), <anonymous>:10:17)
        at async responseViaResponseObject (file:///app/node_modules/@hono/node-server/dist/index.mjs:370:13)
        at async Server.<anonymous> (file:///app/node_modules/@hono/node-server/dist/index.mjs:446:14)
  },
  code: 'PARSE'
}
[onError] {
  error: ParseError: Bad Request
      at handle (eval at composeHandler (file:///app/node_modules/elysia/dist/index.mjs:4451:12), <anonymous>:25:22)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async responseViaResponseObject (file:///app/node_modules/@hono/node-server/dist/index.mjs:370:13)
      at async Server.<anonymous> (file:///app/node_modules/@hono/node-server/dist/index.mjs:446:14) {
    code: 'PARSE',
    status: 400,
    [cause]: SyntaxError: Expected property name or '}' in JSON at position 1 (line 1 column 2)
        at JSON.parse (<anonymous>)
        at parseJSONFromBytes (node:internal/deps/undici/undici:5738:19)
        at successSteps (node:internal/deps/undici/undici:5719:27)
        at fullyReadBody (node:internal/deps/undici/undici:4609:9)
        at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
        at async consumeBody (node:internal/deps/undici/undici:5728:7)
        at async handle (eval at composeHandler (file:///app/node_modules/elysia/dist/index.mjs:4451:12), <anonymous>:10:17)
        at async responseViaResponseObject (file:///app/node_modules/@hono/node-server/dist/index.mjs:370:13)
        at async Server.<anonymous> (file:///app/node_modules/@hono/node-server/dist/index.mjs:446:14)
  },
  code: 'PARSE'
}

=== Test Execution ===
$ curl -s -D- http://localhost:3000/body -X POST -H "Content-Type: application/json" -d '{'
HTTP/1.1 400 Bad Request
Content-Length: 11
Date: Sun, 01 Jun 2025 06:24:20 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Bad Request

```

:::

### validation_error

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000
[onError] {
  error: 323 | 				null,
324 | 				2
325 | 			)
326 | 		}
327 | 
328 | 		super(message)
        ^
error: {
  "type": "validation",
  "on": "query",
  "summary": "Property 'name' is missing",
  "property": "/name",
  "message": "Expected required property",
  "expected": {
    "name": ""
  },
  "found": {},
  "errors": [
    {
      "type": 45,
      "schema": {
        "type": "string"
      },
      "path": "/name",
      "message": "Expected required property",
      "errors": [],
      "summary": "Property 'name' is missing"
    },
    {
      "type": 54,
      "schema": {
        "type": "string"
      },
      "path": "/name",
      "message": "Expected string",
      "errors": [],
      "summary": "Expected property 'name' to be string but found: undefined"
    }
  ]
}
      type: "query",
 validator: [Object ...],
     value: [Object ...],
    status: 422,
      code: "VALIDATION"

      at new ValidationError (/app/node_modules/elysia/src/error.ts:328:3)
      at handle (file:///app/node_modules/elysia/dist/bun/index.js:14:67)
      at handle (file:///app/node_modules/elysia/dist/bun/index.js:6:80)
,
  code: "VALIDATION",
}

=== Test Execution ===
$ curl -s -D- http://localhost:3000/validate
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json
Date: Sun, 01 Jun 2025 06:24:19 GMT
Content-Length: 680

{
  "type": "validation",
  "on": "query",
  "summary": "Property 'name' is missing",
  "property": "/name",
  "message": "Expected required property",
  "expected": {
    "name": ""
  },
  "found": {},
  "errors": [
    {
      "type": 45,
      "schema": {
        "type": "string"
      },
      "path": "/name",
      "message": "Expected required property",
      "errors": [],
      "summary": "Property 'name' is missing"
    },
    {
      "type": 54,
      "schema": {
        "type": "string"
      },
      "path": "/name",
      "message": "Expected string",
      "errors": [],
      "summary": "Expected property 'name' to be string but found: undefined"
    }
  ]
}

```

```text [node]
=== Runtime Output ===
(node:28) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000
[onError] {
  error: _ValidationError: {
    "type": "validation",
    "on": "query",
    "summary": "Property 'name' is missing",
    "property": "/name",
    "message": "Expected required property",
    "expected": {
      "name": ""
    },
    "found": {},
    "errors": [
      {
        "type": 45,
        "schema": {
          "type": "string"
        },
        "path": "/name",
        "message": "Expected required property",
        "errors": [],
        "summary": "Property 'name' is missing"
      },
      {
        "type": 54,
        "schema": {
          "type": "string"
        },
        "path": "/name",
        "message": "Expected string",
        "errors": [],
        "summary": "Expected property 'name' to be string but found: undefined"
      }
    ]
  }
      at handle (eval at composeHandler (file:///app/node_modules/elysia/dist/index.mjs:4451:12), <anonymous>:14:67)
      at Object.mainHandler (file:///app/node_modules/elysia/dist/index.mjs:6470:162)
      at map (eval at composeGeneralHandler (file:///app/node_modules/elysia/dist/index.mjs:4606:12), <anonymous>:29:76)
      at fetch (file:///app/node_modules/elysia/dist/index.mjs:6021:120)
      at Server.<anonymous> (file:///app/node_modules/@hono/node-server/dist/index.mjs:425:13)
      at Server.emit (node:events:518:28)
      at parserOnIncoming (node:_http_server:1153:12)
      at HTTPParser.parserOnHeadersComplete (node:_http_common:117:17) {
    type: 'query',
    validator: TypeCheck {
      schema: [Object],
      references: [],
      checkFunc: [Function: check],
      code: 'return function check(value) {\n' +
        '  return (\n' +
        "    (typeof value === 'object' && value !== null && !Array.isArray(value)) &&\n" +
        "    (typeof value.name === 'string') &&\n" +
        '    Object.getOwnPropertyNames(value).length === 1\n' +
        '  )\n' +
        '}',
      hasTransform: false,
      Clean: [Function (anonymous)],
      parse: [Function (anonymous)],
      safeParse: [Function (anonymous)],
      hasAdditionalProperties: false,
      hasDefault: false,
      isOptional: false,
      hasRef: undefined,
      '~hasRef': undefined
    },
    value: {},
    code: 'VALIDATION',
    status: 422
  },
  code: 'VALIDATION'
}
[onError] {
  error: _ValidationError: {
    "type": "validation",
    "on": "query",
    "summary": "Property 'name' is missing",
    "property": "/name",
    "message": "Expected required property",
    "expected": {
      "name": ""
    },
    "found": {},
    "errors": [
      {
        "type": 45,
        "schema": {
          "type": "string"
        },
        "path": "/name",
        "message": "Expected required property",
        "errors": [],
        "summary": "Property 'name' is missing"
      },
      {
        "type": 54,
        "schema": {
          "type": "string"
        },
        "path": "/name",
        "message": "Expected string",
        "errors": [],
        "summary": "Expected property 'name' to be string but found: undefined"
      }
    ]
  }
      at handle (eval at composeHandler (file:///app/node_modules/elysia/dist/index.mjs:4451:12), <anonymous>:14:67)
      at Object.mainHandler (file:///app/node_modules/elysia/dist/index.mjs:6470:162)
      at map (eval at composeGeneralHandler (file:///app/node_modules/elysia/dist/index.mjs:4606:12), <anonymous>:29:76)
      at fetch (file:///app/node_modules/elysia/dist/index.mjs:6021:120)
      at Server.<anonymous> (file:///app/node_modules/@hono/node-server/dist/index.mjs:425:13)
      at Server.emit (node:events:518:28)
      at parserOnIncoming (node:_http_server:1153:12)
      at HTTPParser.parserOnHeadersComplete (node:_http_common:117:17) {
    type: 'query',
    validator: TypeCheck {
      schema: [Object],
      references: [],
      checkFunc: [Function: check],
      code: 'return function check(value) {\n' +
        '  return (\n' +
        "    (typeof value === 'object' && value !== null && !Array.isArray(value)) &&\n" +
        "    (typeof value.name === 'string') &&\n" +
        '    Object.getOwnPropertyNames(value).length === 1\n' +
        '  )\n' +
        '}',
      hasTransform: false,
      Clean: [Function (anonymous)],
      parse: [Function (anonymous)],
      safeParse: [Function (anonymous)],
      hasAdditionalProperties: false,
      hasDefault: false,
      isOptional: false,
      hasRef: undefined,
      '~hasRef': undefined
    },
    value: {},
    code: 'VALIDATION',
    status: 422
  },
  code: 'VALIDATION'
}

=== Test Execution ===
$ curl -s -D- http://localhost:3000/validate
HTTP/1.1 400 Bad Request
content-type: application/json
Content-Length: 680
Date: Sun, 01 Jun 2025 06:24:20 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "validation",
  "on": "query",
  "summary": "Property 'name' is missing",
  "property": "/name",
  "message": "Expected required property",
  "expected": {
    "name": ""
  },
  "found": {},
  "errors": [
    {
      "type": 45,
      "schema": {
        "type": "string"
      },
      "path": "/name",
      "message": "Expected required property",
      "errors": [],
      "summary": "Property 'name' is missing"
    },
    {
      "type": 54,
      "schema": {
        "type": "string"
      },
      "path": "/name",
      "message": "Expected string",
      "errors": [],
      "summary": "Expected property 'name' to be string but found: undefined"
    }
  ]
}

```

:::

### invalid_cookie_signature

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000
[onError] {
  error: 105 | 
106 | 	constructor(
107 | 		public key: string,
108 | 		message?: string
109 | 	) {
110 | 		super(message ?? `"${key}" has invalid cookie signature`)
        ^
error: "name" has invalid cookie signature
    key: "name",
 status: 400,
   code: "INVALID_COOKIE_SIGNATURE"

      at new InvalidCookieSignature (/app/node_modules/elysia/src/error.ts:110:3)
      at <anonymous> (/app/node_modules/elysia/src/cookies.ts:337:31)
,
  code: "INVALID_COOKIE_SIGNATURE",
}

=== Test Execution ===
$ curl -s -D- http://localhost:3000/cookie -H "Cookie: name=unsigned"
HTTP/1.1 400 Bad Request
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:19 GMT
Content-Length: 35

"name" has invalid cookie signature

```

```text [node]
=== Runtime Output ===
(node:28) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000
[onError] {
  error: InvalidCookieSignature [Error]: "name" has invalid cookie signature
      at parseCookie (file:///app/node_modules/elysia/dist/index.mjs:1940:32)
      at async handle (eval at composeHandler (file:///app/node_modules/elysia/dist/index.mjs:4451:12), <anonymous>:7:10)
      at async responseViaResponseObject (file:///app/node_modules/@hono/node-server/dist/index.mjs:370:13)
      at async Server.<anonymous> (file:///app/node_modules/@hono/node-server/dist/index.mjs:446:14) {
    key: 'name',
    code: 'INVALID_COOKIE_SIGNATURE',
    status: 400
  },
  code: 'INVALID_COOKIE_SIGNATURE'
}
[onError] {
  error: InvalidCookieSignature [Error]: "name" has invalid cookie signature
      at parseCookie (file:///app/node_modules/elysia/dist/index.mjs:1940:32)
      at async handle (eval at composeHandler (file:///app/node_modules/elysia/dist/index.mjs:4451:12), <anonymous>:7:10)
      at async responseViaResponseObject (file:///app/node_modules/@hono/node-server/dist/index.mjs:370:13)
      at async Server.<anonymous> (file:///app/node_modules/@hono/node-server/dist/index.mjs:446:14) {
    key: 'name',
    code: 'INVALID_COOKIE_SIGNATURE',
    status: 400
  },
  code: 'INVALID_COOKIE_SIGNATURE'
}

=== Test Execution ===
$ curl -s -D- http://localhost:3000/cookie -H "Cookie: name=unsigned"
HTTP/1.1 400 Bad Request
Content-Length: 35
Date: Sun, 01 Jun 2025 06:24:21 GMT
Connection: keep-alive
Keep-Alive: timeout=5

"name" has invalid cookie signature

```

:::

### internal_server_error

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000
[onError] {
  error: 73 | export class InternalServerError extends Error {
74 | 	code = 'INTERNAL_SERVER_ERROR'
75 | 	status = 500
76 | 
77 | 	constructor(message?: string) {
78 | 		super(message ?? 'INTERNAL_SERVER_ERROR')
       ^
error: Something went wrong!
 status: 500,
   code: "INTERNAL_SERVER_ERROR"

      at new InternalServerError (/app/node_modules/elysia/src/error.ts:78:3)
      at <anonymous> (/app/examples-v2/errors-built-in.example.ts:7:11)
      at <anonymous> (/app/examples-v2/errors-built-in.example.ts:6:27)
      at handle (file:///app/node_modules/elysia/dist/bun/index.js:6:76)
      at handle (file:///app/node_modules/elysia/dist/bun/index.js:6:80)
,
  code: "INTERNAL_SERVER_ERROR",
}

=== Test Execution ===
$ curl -s -D- http://localhost:3000/crash/internal
HTTP/1.1 500 Internal Server Error
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:21 GMT
Content-Length: 21

Something went wrong!

```

```text [node]
=== Runtime Output ===
(node:29) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000
[onError] {
  error: InternalServerError: Something went wrong!
      at <anonymous> (/app/examples-v2/errors-built-in.example.ts:7:11)
      at handle (eval at composeHandler (file:///app/node_modules/elysia/dist/index.mjs:4451:12), <anonymous>:6:69)
      at Object.mainHandler (file:///app/node_modules/elysia/dist/index.mjs:6470:162)
      at map (eval at composeGeneralHandler (file:///app/node_modules/elysia/dist/index.mjs:4606:12), <anonymous>:23:87)
      at fetch (file:///app/node_modules/elysia/dist/index.mjs:6021:120)
      at Server.<anonymous> (file:///app/node_modules/@hono/node-server/dist/index.mjs:425:13)
      at Server.emit (node:events:518:28)
      at parserOnIncoming (node:_http_server:1153:12)
      at HTTPParser.parserOnHeadersComplete (node:_http_common:117:17) {
    code: 'INTERNAL_SERVER_ERROR',
    status: 500
  },
  code: 'INTERNAL_SERVER_ERROR'
}
[onError] {
  error: InternalServerError: Something went wrong!
      at <anonymous> (/app/examples-v2/errors-built-in.example.ts:7:11)
      at handle (eval at composeHandler (file:///app/node_modules/elysia/dist/index.mjs:4451:12), <anonymous>:6:69)
      at Object.mainHandler (file:///app/node_modules/elysia/dist/index.mjs:6470:162)
      at map (eval at composeGeneralHandler (file:///app/node_modules/elysia/dist/index.mjs:4606:12), <anonymous>:23:87)
      at fetch (file:///app/node_modules/elysia/dist/index.mjs:6021:120)
      at Server.<anonymous> (file:///app/node_modules/@hono/node-server/dist/index.mjs:425:13)
      at Server.emit (node:events:518:28)
      at parserOnIncoming (node:_http_server:1153:12)
      at HTTPParser.parserOnHeadersComplete (node:_http_common:117:17) {
    code: 'INTERNAL_SERVER_ERROR',
    status: 500
  },
  code: 'INTERNAL_SERVER_ERROR'
}

=== Test Execution ===
$ curl -s -D- http://localhost:3000/crash/internal
HTTP/1.1 500 Internal Server Error
Content-Length: 21
Date: Sun, 01 Jun 2025 06:24:22 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Something went wrong!

```

:::

### generic_error

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000
[onError] {
  error:  5 |   })
 6 |   .get("/crash/internal", async () => {
 7 |     throw new InternalServerError("Something went wrong!");
 8 |   })
 9 |   .get("/crash/error", async () => {
10 |     throw new Error("Something went wrong!");
               ^
error: Something went wrong!
      at <anonymous> (/app/examples-v2/errors-built-in.example.ts:10:11)
      at <anonymous> (/app/examples-v2/errors-built-in.example.ts:9:24)
      at handle (file:///app/node_modules/elysia/dist/bun/index.js:6:76)
      at handle (file:///app/node_modules/elysia/dist/bun/index.js:6:80)
,
  code: "UNKNOWN",
}

=== Test Execution ===
$ curl -s -D- http://localhost:3000/crash/error
HTTP/1.1 500 Internal Server Error
content-type: text/plain;charset=utf-8
Date: Sun, 01 Jun 2025 06:24:21 GMT
Content-Length: 21

Something went wrong!

```

```text [node]
=== Runtime Output ===
(node:27) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000
[onError] {
  error: Error: Something went wrong!
      at <anonymous> (/app/examples-v2/errors-built-in.example.ts:10:11)
      at handle (eval at composeHandler (file:///app/node_modules/elysia/dist/index.mjs:4451:12), <anonymous>:6:69)
      at Object.mainHandler (file:///app/node_modules/elysia/dist/index.mjs:6470:162)
      at map (eval at composeGeneralHandler (file:///app/node_modules/elysia/dist/index.mjs:4606:12), <anonymous>:25:82)
      at fetch (file:///app/node_modules/elysia/dist/index.mjs:6021:120)
      at Server.<anonymous> (file:///app/node_modules/@hono/node-server/dist/index.mjs:425:13)
      at Server.emit (node:events:518:28)
      at parserOnIncoming (node:_http_server:1153:12)
      at HTTPParser.parserOnHeadersComplete (node:_http_common:117:17),
  code: 'UNKNOWN'
}
[onError] {
  error: Error: Something went wrong!
      at <anonymous> (/app/examples-v2/errors-built-in.example.ts:10:11)
      at handle (eval at composeHandler (file:///app/node_modules/elysia/dist/index.mjs:4451:12), <anonymous>:6:69)
      at Object.mainHandler (file:///app/node_modules/elysia/dist/index.mjs:6470:162)
      at map (eval at composeGeneralHandler (file:///app/node_modules/elysia/dist/index.mjs:4606:12), <anonymous>:25:82)
      at fetch (file:///app/node_modules/elysia/dist/index.mjs:6021:120)
      at Server.<anonymous> (file:///app/node_modules/@hono/node-server/dist/index.mjs:425:13)
      at Server.emit (node:events:518:28)
      at parserOnIncoming (node:_http_server:1153:12)
      at HTTPParser.parserOnHeadersComplete (node:_http_common:117:17),
  code: 'UNKNOWN'
}

=== Test Execution ===
$ curl -s -D- http://localhost:3000/crash/error
HTTP/1.1 500 Internal Server Error
Content-Length: 21
Date: Sun, 01 Jun 2025 06:24:23 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Something went wrong!

```

:::
