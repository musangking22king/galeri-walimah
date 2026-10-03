import { getStore } from "@netlify/blobs";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export default async (req, context) => {
  if (req.method !== "DELETE") return json({ error: "Kaedah tidak dibenarkan." }, 405);

  const key = process.env.ADMIN_KEY;
  if (!key || req.headers.get("x-admin-key") !== key) return json({ error: "Tiada kebenaran." }, 403);

  const id = context.params.id;
  if (!/^\d{13}-[0-9a-f]{6}$/.test(id)) return json({ error: "ID tidak sah." }, 400);

  await getStore("meta").delete(id);
  await getStore("photos").delete(id);
  return json({ ok: true });
};

export const config = { path: "/api/photos/:id" };
