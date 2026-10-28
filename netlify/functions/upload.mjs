// POST   /api/upload            → store a photo (JPEG, already resized in the browser), returns its URL
// DELETE /api/upload?key=...    → remove a photo that is no longer used
import { images, authorised, json } from "../lib/shared.mjs";

const MAX = 5 * 1024 * 1024;

export default async (req) => {
  if (!authorised(req)) return json({ error: "unauthorised" }, 401);
  const store = images();

  if (req.method === "POST") {
    const type = (req.headers.get("content-type") || "").split(";")[0];
    if (!["image/jpeg", "image/webp", "image/png"].includes(type)) return json({ error: "photo expected" }, 415);
    const buf = await req.arrayBuffer();
    if (!buf.byteLength || buf.byteLength > MAX) return json({ error: "photo too large" }, 413);
    const key = `w-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    await store.set(key, buf, { metadata: { type } });
    return json({ url: `/img/${key}` });
  }

  if (req.method === "DELETE") {
    const key = new URL(req.url).searchParams.get("key") || "";
    if (!/^w-[\w-]+$/.test(key)) return json({ error: "bad key" }, 400);
    await store.delete(key);
    return json({ ok: true });
  }

  return json({ error: "method not allowed" }, 405);
};

export const config = { path: "/api/upload" };
