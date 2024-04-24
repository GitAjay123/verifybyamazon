import search from "./search";
import header from "./header";
import product from "./product";

async function handleRequest(request) {
  /* Handle the incoming request */
  const headers = header(request.headers);
  const path = new URL(request.url).pathname; /* Get the pathname */

  if (request.method === "GET") {
    /* Respond for GET request method */
    if (path.startsWith("/search/")) {
      /* Search */
      return new Response(
        await search(path.replace("/search/", ""), request.headers.get("host")),
        {
          status: 200,
          headers,
        }
      );
    } else if (path.startsWith("/product/")) {
      /* Product Page */
      return new Response(await product(path.replace("/product/", "")), {
        status: 200,
        headers,
      });
    } else {
      return new Response(
        JSON.stringify(
          {
            /* Extra curricular activities */ alive: true,
            repository_name: "verifybyamazon",
            repository_description:
              "Serverless with search and product API, made with Cloudflare worker",
            repository_url: "https://github.com/GitAjay123/verifybyamazon",
            made_by: "https://github.com/GitAjay123",
            api_endpoints:
              "https://github.com/GitAjay123/verifybyamazon#api-endpoint",
          },
          null,
          2
        ),
        {
          status: 200,
          headers,
        }
      );
    }
  } else if (request.method === "OPTIONS") {
    /* Respond for OPTIONS request method */
    return new Response("🤝", {
      status: 200,
      headers,
    });
  } else {
    /* Respond for other request methods */
    return Response.redirect("https://github.com/GitAjay123/verifybyamazon", 301);
  }
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
