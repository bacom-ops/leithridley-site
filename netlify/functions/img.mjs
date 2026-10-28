// GET /img/:key → a photo uploaded from the studio space
import { images } from "../lib/shared.mjs";

export default async (req, context) => {
  const key = context.params?.key || new URL(req.url).pathname.split("/").pop();
  if (!/^w-[\w-]+$/.test(key || "")) return new Response("Not found", { status: 404 });
  const found = await images().getWithMetadata(key, { type: "arrayBuffer" });
  if (!found) return new Response("Not found", { status: 404 });
  return new Response(found.data, {
    headers: {
      "content-type": found.metadata?.type || "image/jpeg",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
};

export const config = { path: "/img/:key" };
