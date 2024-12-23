// ## The `error` function
// You can call the `error` function to generate an error response (an instance of `ElysiaCustomStatusResponse`), which should then be returned.
import { Elysia } from "elysia";
export default new Elysia()
  .onError(({ code }) => {
    console.log("[onError]", code);
  })
  .get("/return", async ({ error }) => {
    return error("I'm a teapot", { message: "meow!" });
  })
  .get("/throw", async ({ error }) => {
    // INCORRECT: Do NOT throw an instance of `ElysiaCustomStatusResponse`.
    throw error("I'm a teapot", { message: "meow!" });
  });

// [prose]

// As the error object is returned, the `onError` hook is NOT called.
//$ curl -s -D- $SERVER/return # `GET /return`

// As `ElysiaCustomStatusResponse` is not an instance of `Error`, you should not `throw` it.
// Otherwise, the response body will not be formatted correctly.
//$ curl -s -D- $SERVER/throw # `GET /throw`
