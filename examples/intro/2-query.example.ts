// ## Handling requests
//
// Here’s a slightly more complex example that shows how to handle requests.
//
export default {
  async fetch(request: Request) {
    // Parse the request URL.
    const url = new URL(request.url);

    // Extract the `name` query parameter (with a default value).
    const name = url.searchParams.get("name") || "world";

    // Create a greeting message.
    const greeting = `hello ${name}`;

    // Return a Response.
    return new Response(greeting, { status: 200 });
  },
};

// [prose]
//$ curl -s -D- $SERVER # No query parameter
//$ curl -s -D- "$SERVER?name=alice" # With a `name` query parameter
//
// This fetch handler is called for every request, regardless of the HTTP method or path.
//
//$ curl -s -D- -X PUT $SERVER # PUT request
//$ curl -s -D- -X PUT $SERVER/this/is/irrelevant # A request with arbitrary path
//
// Therefore, it is up to the handler to decide how to respond to the request.
//
// Deciding what to do based on the request method and path combination is the job of the **router**.
// Elysia is one such router that you can use with Bun.
// However, you can also manually handle routes without a router, as shown in the next example.
