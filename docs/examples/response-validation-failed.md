# response-validation-failed

## Example Code

```typescript
import { Elysia, t } from "elysia";
export default new Elysia()
  .onError(({ code }) => {
    console.log("[onError]", code);
  })
  .get(
    "/",
    async () => {
      return { a: "x" as any };
    },
    { response: t.Object({ a: t.Number() }) }
  );


```

## Tests

### test

::: code-group

```text [bun]
=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000
[onError] VALIDATION

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/"
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json
Date: Sun, 01 Jun 2025 06:24:11 GMT
Content-Length: 425

{
  "type": "validation",
  "on": "response",
  "summary": "Expected number",
  "property": "/a",
  "message": "Expected number",
  "expected": {
    "a": 0
  },
  "found": {
    "a": "x"
  },
  "errors": [
    {
      "summary": "Expected number",
      "type": 41,
      "schema": {
        "type": "number"
      },
      "path": "/a",
      "value": "x",
      "message": "Expected number",
      "errors": []
    }
  ]
}
✓ expect: 422

```

```text [node]
=== Runtime Output ===
(node:27) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000
[onError] VALIDATION
[onError] VALIDATION

=== Test Execution ===
$ curl -s -D- "http://localhost:3000/"
HTTP/1.1 400 Bad Request
content-type: application/json
Content-Length: 425
Date: Sun, 01 Jun 2025 06:24:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "validation",
  "on": "response",
  "summary": "Expected number",
  "property": "/a",
  "message": "Expected number",
  "expected": {
    "a": 0
  },
  "found": {
    "a": "x"
  },
  "errors": [
    {
      "summary": "Expected number",
      "type": 41,
      "schema": {
        "type": "number"
      },
      "path": "/a",
      "value": "x",
      "message": "Expected number",
      "errors": []
    }
  ]
}
✗ expect: 422

=== Error ===
Expected "422" but got: "HTTP/1.1 400 Bad Request
content-type: application/json
Content-Length: 425
Date: Sun, 01 Jun 2025 06:24:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "validation",
  "on": "response",
  "summary": "Expected number",
  "property": "/a",
  "message": "Expected number",
  "expected": {
    "a": 0
  },
  "found": {
    "a": "x"
  },
  "errors": [
    {
      "summary": "Expected number",
      "type": 41,
      "schema": {
        "type": "number"
      },
      "path": "/a",
      "value": "x",
      "message": "Expected number",
      "errors": []
    }
  ]
}"

```

:::
