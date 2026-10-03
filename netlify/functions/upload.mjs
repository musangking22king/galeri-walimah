import { getStore } from "@netlify/blobs";
import { randomBytes, createHash } from "node:crypto";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const hashToken = (t) =>
  /^[A-Za-z0-9-]{16,64}$/.test(t || "") ? createHash("sha256").update(t).digest("hex") : "";

// Had gambar bagi setiap telefon. Boleh ditukar melalui pembolehubah MAX_PER_GUEST di Netlify.
const LIMIT = Number(process.env.MAX_PER_GUEST) || 10;

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Kaedah tidak dibenarkan." }, 405);

  let form;
  try { form = await req.formData(); } catch { return json({ error: "Data tidak sah." }, 400); }

  const ownerHash = hashToken(String(form.get("token") || ""));
  if (!ownerHash) return json({ error: "Sila muat semula halaman dan cuba lagi." }, 400);

  const owners = getStore("owners");
  const rec = (await owners.get(ownerHash, { type: "json" })) || { count: 0 };
  if (rec.count >= LIMIT) {
    return json({ error: `Anda telah hantar ${LIMIT} gambar, iaitu had maksimum. Padam gambar lama di galeri jika mahu hantar yang baharu.` }, 429);
  }

  const file = form.get("photo");
  if (!file || typeof file === "string") return json({ error: "Gambar tidak sah." }, 400);
  if (file.size > 4 * 1024 * 1024) return json({ error: "Gambar terlalu besar." }, 413);

  const buf = await file.arrayBuffer();
  const b = new Uint8Array(buf);
  if (!(b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff)) return json({ error: "Hanya gambar JPEG." }, 400);

  const id = String(Date.now()).padStart(13, "0") + "-" + randomBytes(3).toString("hex");
  const meta = {
    id,
    imageUrl: "/api/img/" + id,
    senderName: String(form.get("name") || "").trim().slice(0, 40),
    message: String(form.get("message") || "").trim().slice(0, 200),
    createdAt: Date.now(),
    ownerHash // tidak pernah dihantar balik kepada pelayar
  };

  // Simpan gambar dahulu, kemudian meta, supaya senarai tak pernah tunjuk gambar yang belum ada
  await getStore("photos").set(id, buf);
  await getStore("meta").setJSON(id, meta);

  const count = rec.count + 1;
  await owners.setJSON(ownerHash, { count });
  return json({ ok: true, count, limit: LIMIT });
};

export const config = { path: "/api/upload" };
