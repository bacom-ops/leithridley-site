// GET  /api/works          → the list of works shown on the site (public)
// PUT  /api/works          → replace the list (studio space only)
// POST /api/works?check=1  → check the studio password
import { works, authorised, json, clean } from "../lib/shared.mjs";

export default async (req) => {
  const store = works();

  if (req.method === "GET") {
    let list = await store.get("works", { type: "json" });
    if (!Array.isArray(list)) {
      // first visit: start from the works that ship with the site
      const r = await fetch(new URL("/works.json", req.url));
      list = r.ok ? await r.json() : [];
    }
    return json(list);
  }

  if (!authorised(req)) return json({ error: "unauthorised" }, 401);

  if (req.method === "POST" && new URL(req.url).searchParams.has("check")) return json({ ok: true });

  // undo: swap the current list with the one saved just before it
  if (req.method === "POST" && new URL(req.url).searchParams.has("restore")) {
    const prev = await store.get("works-previous", { type: "json" });
    if (!Array.isArray(prev)) return json({ error: "nothing to undo" }, 409);
    const now = await store.get("works", { type: "json" });
    await store.setJSON("works", prev);
    if (Array.isArray(now)) await store.setJSON("works-previous", now);
    return json({ ok: true });
  }

  if (req.method === "PUT") {
    let body;
    try { body = await req.json(); } catch { return json({ error: "invalid json" }, 400); }
    if (!Array.isArray(body) || body.length > 2000) return json({ error: "expected a list" }, 400);
    const list = body.map(clean).filter(Boolean);
    if (list.length !== body.length) return json({ error: "some works are incomplete" }, 422);
    // keep the previous version, so a mistake can always be undone
    const prev = await store.get("works", { type: "json" });
    if (Array.isArray(prev)) await store.setJSON("works-previous", prev);
    await store.setJSON("works", list);
    return json({ ok: true, count: list.length });
  }

  return json({ error: "method not allowed" }, 405);
};

export const config = { path: "/api/works" };
