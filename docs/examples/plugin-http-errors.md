# plugin-http-errors

## Example Code

```typescript
import Elysia, { t } from "elysia";
import createHttpError from "http-errors";

const httpErrorsPlugin = new Elysia({ name: "http-errors" })
  .model({
    error: t.Object({
      error: t.Object({ message: t.String() }),
    }),
  })
  .onError(({ error, set }) => {
    if (createHttpError.isHttpError(error)) {
      set.status = error.status;
      return {
        error: {
          message: error.expose ? error.message : "Something went wrong...",
        },
      };
    }
  })
  .as("plugin");

export default new Elysia().use(httpErrorsPlugin).get(
  "/",
  async ({ query: { crash } }) => {
    if (crash === "418") {
      throw createHttpError.ImATeapot("meow");
    }
    if (crash === "500") {
      throw createHttpError.InternalServerError("woof");
    }
    return { ok: true };
  },
  {
    query: t.Object({ crash: t.String() }),
    response: {
      200: t.Object({ ok: t.Literal(true) }),
      418: "error",
      500: "error",
    },
  }
);




```

## Tests

| Test | bun | node |
| --- | --- | --- |
| [200](#200) | 🏃 | 🏃 |
| [418](#418) | 🏃 | 🏃 |
| [500](#500) | 🏃 | 🏃 |

### 200

::: code-group

```text [bun]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000?crash=no"
HTTP/1.1 200 OK
Content-Type: application/json
Date: Sun, 01 Jun 2025 06:23:48 GMT
Content-Length: 11

{"ok":true}

=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

```

```text [node]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000?crash=no"
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 11
Date: Sun, 01 Jun 2025 06:23:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"ok":true}

=== Runtime Output ===
(node:28) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

```

:::

### 418

::: code-group

```text [bun]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000?crash=418"
HTTP/1.1 418 I'm a Teapot
Content-Type: application/json
Date: Sun, 01 Jun 2025 06:23:49 GMT
Content-Length: 28

{"error":{"message":"meow"}}

=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

```

```text [node]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000?crash=418"
HTTP/1.1 418 I'm a Teapot
content-type: application/json
Content-Length: 28
Date: Sun, 01 Jun 2025 06:23:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":{"message":"meow"}}

=== Runtime Output ===
(node:26) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

```

:::

### 500

::: code-group

```text [bun]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000?crash=500"
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
Date: Sun, 01 Jun 2025 06:23:49 GMT
Content-Length: 47

{"error":{"message":"Something went wrong..."}}

=== Runtime Output ===
[runtime] Bun 1.2.15
Started development server: http://localhost:3000

```

```text [node]
=== Test Execution ===
$ curl -s -D- "http://localhost:3000?crash=500"
HTTP/1.1 500 Internal Server Error
content-type: application/json
Content-Length: 47
Date: Sun, 01 Jun 2025 06:23:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":{"message":"Something went wrong..."}}

=== Runtime Output ===
(node:28) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[runtime] Node v22.16.0
🦊 Elysia is running at :::3000

```

:::
