// Shared helpers for the studio space (/atelier).
import { getStore } from "@netlify/blobs";

export const works = () => getStore({ name: "atelier", consistency: "strong" });
export const images = () => getStore({ name: "atelier-images", consistency: "strong" });

// The password is set once in Netlify: Site configuration > Environment variables > ADMIN_PASSWORD
export function authorised(req) {
  const expected = process.env.ADMIN_PASSWORD || "";
  const given = req.headers.get("x-atelier-key") || "";
  if (!expected || given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0;
}

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export const CATS = ["pages", "trees", "mountain", "flowers", "portraits", "abstracts"];
export const STATUSES = ["avail", "hold", "sold", "private"];
export const TECHS = [
  "oil_linen", "oil_canvas", "oil_board", "oil_paper",
  "acry", "acry_linen", "acry_canvas", "acry_board", "acry_paper",
  "acryoil", "acryoil_linen", "acryoil_canvas",
  "acry_collage_linen", "acry_collage_canvas",
  "mixed_canvas", "watercolour_paper", "linen",
];

const num = (v, min, max) => (typeof v === "number" && Number.isFinite(v) && v >= min && v <= max ? v : undefined);
const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

// Keep only the fields the site understands, in the expected shape.
export function clean(w) {
  if (!w || typeof w !== "object") return null;
  let t = w.t;
  if (t && typeof t === "object") {
    const fr = str(t.fr, 160), en = str(t.en, 160);
    t = fr && en && fr !== en ? { fr, en } : fr || en;
  } else t = str(t, 160);
  const img = str(w.img, 300);
  if (!t || !img || !/^(works\/[\w.-]+\.jpe?g|\/img\/[\w-]+)$/.test(img)) return null;
  const cat = [].concat(w.cat).filter((c) => CATS.includes(c));
  if (!cat.length) return null;
  const out = {
    id: str(w.id, 80) || img,
    t,
    cat: cat.length === 1 ? cat[0] : cat,
    st: ["abstract", "landscape", "still"].includes(w.st) ? w.st : "still",
    img,
    seed: num(w.seed, 0, 1e9) ?? Math.floor(Math.random() * 1e6),
    pal: Array.isArray(w.pal) && w.pal.length === 5 && w.pal.every((c) => /^#[0-9a-f]{6}$/i.test(c)) ? w.pal : ["#2a2622", "#6b5a4a", "#c9a487", "#e8e0d0", "#1a1714"],
  };
  if (TECHS.includes(w.tech)) out.tech = w.tech;
  const h = num(w.h, 1, 1000), wd = num(w.w, 1, 1000);
  if (h && wd) { out.h = h; out.w = wd; }
  const y = num(w.y, 1950, 2100); if (y) out.y = y;
  if (STATUSES.includes(w.s)) out.s = w.s;
  const p = num(w.p, 1, 10000000); if (p && out.s === "avail") out.p = p;
  if (["EUR", "USD", "GBP", "BGN"].includes(w.cur)) out.cur = w.cur;
  const sg = str(w.sg, 400); if (sg && /^https:\/\/(www\.)?singulart\.com\//.test(sg)) out.sg = sg;
  if (w.hero === true) out.hero = true;
  if (w.hidden === true) out.hidden = true;
  return out;
}
