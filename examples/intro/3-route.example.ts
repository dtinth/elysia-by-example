// ## Manually handling routes without a router
//
// We can manually handle routes by checking the request URL’s pathname and method.
//
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      // Handle GET /
      return new Response("it is working!", { status: 200 });
    } else if (request.method === "GET" && url.pathname === "/greeting") {
      // Handle GET /greeting
      const name = url.searchParams.get("name") || "world";
      const greeting = `hello ${name}`;
      return new Response(greeting, { status: 200 });
    } else {
      // Handle everything else
      return new Response("not found", { status: 404 });
    }
  },
};

// [prose]
//$ curl -s -D- "$SERVER" # `GET /`
//$ curl -s -D- "$SERVER/greeting" # `GET /greeting`
//$ curl -s -D- "$SERVER/greeting?name=alice" # `GET /greeting?name=alice`
//$ curl -s -D- "$SERVER/nonexistent" # `GET /nonexistent`
//$ curl -s -D- "$SERVER" -X POST # `POST /`
//
// Now let’s introduce Elysia and then see how it simplifies routing, request handling, response creation, and more.
