import { getStore } from "@netlify/blobs";

const PAGE = 60;

export default async (req) => {
  const since = new URL(req.url).searchParams.get("since") || "";
  const meta = getStore("meta");

  const { blobs } = await meta.list();
  const all = blobs.map((b) => b.key).sort(); // lama -> baru
  const fresh = all.filter((id) => id > since);
  const batch = fresh.slice(0, PAGE); // paling lama dahulu supaya kursor tak terlepas
  const items = (await Promise.all(batch.map((id) => meta.get(id, { type: "json" })))).filter(Boolean);

  return new Response(
    JSON.stringify({ ids: all.reverse(), items, more: fresh.length > PAGE }),
    { headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } }
  );
};

export const config = { path: "/api/photos" };
