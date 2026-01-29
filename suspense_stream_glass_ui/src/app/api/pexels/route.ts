/*
  Decision log:
  - Two ways to expose Pexels to the client:
    A) Multiple routes (/curated, /search, /photos/[id]).
    B) Single route with 'resource' query.
    -> Chose B for simplicity while teaching; easy to expand later.
  - Caching in route handlers:
    A) 'no-store' for fresh CSR responses.
    B) 'revalidate' for cached API responses.
    -> Chose A for client responsiveness; server components will demo 'revalidate'.
*/
import { NextRequest } from "next/server";

const PEXELS_API_BASE = "https://api.pexels.com/v1";

function getApiKey(): string {
  const key = process.env.PEXELS_API_KEY;
  if (!key) {
    throw new Error("PEXELS_API_KEY is missing");
  }
  return key;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const resource = searchParams.get("resource") || "curated";
  const page = searchParams.get("page") || "1";
  const per_page = searchParams.get("per_page") || "12";
  const query = searchParams.get("query") || "";
  const id = searchParams.get("id");

  let url: string;
  if (resource === "curated") {
    url = `${PEXELS_API_BASE}/curated?page=${page}&per_page=${per_page}`;
  } else if (resource === "search") {
    if (!query) {
      return Response.json({ error: "Missing query" }, { status: 400 });
    }
    url = `${PEXELS_API_BASE}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${per_page}`;
  } else if (resource === "photo") {
    if (!id) {
      return Response.json({ error: "Missing id" }, { status: 400 });
    }
    url = `${PEXELS_API_BASE}/photos/${id}`;
  } else {
    return Response.json({ error: "Unknown resource" }, { status: 400 });
  }

  try {
    const key = getApiKey();
    const res = await fetch(url, {
      headers: { Authorization: key },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(text || JSON.stringify({ error: "Upstream error" }), {
        status: res.status,
      });
    }

    const data = await res.json();
    return Response.json(data, { status: 200 });
  } catch (err: any) {
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
}