import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";


const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path:"/hola",
  method:"GET",
  handler: httpAction(async (ctx, request) => {
    return new Response("Hola mundo", { status: 200 });
  })
})

//#region
http.route({
  path: "/sendFile",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const useridentity = await ctx.auth.getUserIdentity()
    if (!useridentity) {
      return new Response(null, { status: 401 });
    }

    const blob = await request.blob();
    const storageId = await ctx.storage.store(blob);

    const fileurl = ctx.storage.getUrl(storageId)

  return new Response(JSON.stringify({ storageId, fileurl }), {
    status: 200,
    headers: new Headers({
      // e.g. https://mywebsite.com, configured on your Convex dashboard
      "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
      Vary: "origin",
    }),
  })


    // const file = await request.formData();
    // const fileData = file.get("file");
    // const fileDataBuffer = await fileData?.arrayBuffer();
    // const fileDataArray = new Uint8Array(fileDataBuffer!);
    // const fileDataString = Buffer.from(fileDataArray).toString("base64");
    // return { fileDataString };
  })
})

// Pre-flight request for /sendImage
http.route({
  path: "/sendImage",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          // e.g. https://mywebsite.com, configured on your Convex dashboard
          "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Digest",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});
//#endregion

export default http;