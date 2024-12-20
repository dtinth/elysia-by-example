// ## Just routing
//
// ::: danger Not idiomatic
// The following code is not idiomatic Elysia code. We will gradually refactor it to idiomatic Elysia in the following examples.
// :::
//
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

// [prose]

// A route takes 3 arguments:
//
// 1. The pathname pattern.
// 2. The handler function which receives a `context` object and resolves to a response.
//    - In this example, the `context` contains (among others) the `request` property which refers to the original `Request` object.
//    - It is customary to use destructuring to extract the properties you need from the `context` object. When you use destructuring, Elysia can statically analyze your function’s argument list to determine which context properties it’s actually using. This helps Elysia to optimize its performance.
// 3. An optional `options` object.
//    - In this example, we don’t specify any options, but they will be useful in future examples.

//$ curl -s -D- "$SERVER" # `GET /`
//$ curl -s -D- "$SERVER/greeting" # `GET /greeting`
//$ curl -s -D- "$SERVER/greeting?name=alice" # `GET /greeting?name=alice`
//$ curl -s -D- "$SERVER/nonexistent" # `GET /nonexistent`
//$ curl -s -D- "$SERVER" -X POST # `POST /`
