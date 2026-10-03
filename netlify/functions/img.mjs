import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const id = context.params.id;
  if (!/^\d{13}-[0-9a-f]{6}$/.test(id)) return new Response("Tiada", { status: 404 });

  const data = await getStore("photos").get(id, { type: "arrayBuffer" });
  if (!data) return new Response("Tiada", { status: 404 });

  return new Response(data, {
    headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=31536000, immutable" }
  });
};

export const config = { path: "/api/img/:id" };
