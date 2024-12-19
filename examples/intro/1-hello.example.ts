// # Introduction
//
// In Bun, you can start a web server without having to explicitly call
// the [`Bun.serve()`](https://bun.sh/docs/api/http) method.
// Instead, you can just [`export default` an object that has a `fetch` method](https://bun.sh/docs/api/http#export-default-syntax).
//
// The `fetch()` method should:
//
// 1. Accept a `Request` object.
// 2. Return a `Response` object.
//
export default {
  async fetch(request: Request) {
    return new Response("hello world", { status: 200 });
  },
};

// [prose]
// ## Running the example
//
// When you run:
// ```sh
// bun $EXAMPLE
// ```
//
// You should see:
// ```
// Started development server: http://localhost:3000
// ```
//
// - You can configure the listening port by setting the `PORT` environment variable.
// - If you set `NODE_ENV=production`, it will say “Started server” instead of “Started development server”.
//
//$ curl -s -D- $SERVER
