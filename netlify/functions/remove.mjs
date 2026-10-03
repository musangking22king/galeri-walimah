import { getStore } from "@netlify/blobs";
import { createHash } from "node:crypto";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export default async (req, context) => {
  if (req.method !== "DELETE") return json({ error: "Kaedah tidak dibenarkan." }, 405);

  const id = context.params.id;
  if (!/^\d{13}-[0-9a-f]{6}$/.test(id)) return json({ error: "ID tidak sah." }, 400);

  const meta = getStore("meta");
  const item = await meta.get(id, { type: "json" });
  if (!item) return json({ error: "Gambar tiada." }, 404);

  // Penganjur: kunci admin. Tetamu: token peranti yang sama dengan yang menghantar gambar.
  const adminKey = process.env.ADMIN_KEY;
  const isAdmin = !!adminKey && req.headers.get("x-admin-key") === adminKey;

  const token = req.headers.get("x-guest-token") || "";
  const myHash = /^[A-Za-z0-9-]{16,64}$/.test(token) ? createHash("sha256").update(token).digest("hex") : "";
  const isOwner = !!myHash && !!item.ownerHash && item.ownerHash === myHash;

  if (!isAdmin && !isOwner) return json({ error: "Anda hanya boleh padam gambar sendiri." }, 403);

  await meta.delete(id);
  await getStore("photos").delete(id);

  // Pulangkan satu slot kepada pemilik gambar (sama ada tetamu atau penganjur yang memadam)
  if (item.ownerHash) {
    const owners = getStore("owners");
    const rec = (await owners.get(item.ownerHash, { type: "json" })) || { count: 0 };
    await owners.setJSON(item.ownerHash, { count: Math.max(0, rec.count - 1) });
  }
  return json({ ok: true });
};

export const config = { path: "/api/photos/:id" };
