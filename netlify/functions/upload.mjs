import { getStore } from "@netlify/blobs";
import { randomBytes } from "node:crypto";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Kaedah tidak dibenarkan." }, 405);

  let form;
  try { form = await req.formData(); } catch { return json({ error: "Data tidak sah." }, 400); }

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
    createdAt: Date.now()
  };

  // Simpan gambar dahulu, kemudian meta, supaya senarai tak pernah tunjuk gambar yang belum ada
  await getStore("photos").set(id, buf);
  await getStore("meta").setJSON(id, meta);
  return json({ ok: true });
};

export const config = { path: "/api/upload" };
