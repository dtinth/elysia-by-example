export default {
  fetch(request: Request) {
    // Parse the URL
    const url = new URL(request.url);

    // Extract the "name" query parameter
    const name =
      url.searchParams.get("name") || "world";

    // Return a response
    return new Response("hello " + name, {
      status: 200,
    });
  },
};
