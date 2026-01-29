/*
  Decision log:
  - Endpoint choice:
    A) Curated (generic, often missing alt).
    B) Search with a default query (more descriptive alt).
    -> Chose B: 'search?query=nature' for better titles; keep 'cache: no-store' for dynamic streaming.
  - Hover effects:
    -> Added 'transition', 'hover:scale-[1.01]', 'hover:shadow-lg' to each card.
  - Badges & CTA:
    -> DaisyUI 'badge-ghost' for photographer and 'View on Pexels' button in 'card-actions'.
*/

import Image from "next/image";
import Link from "next/link";

type PexelsPhoto = {
  id: number;
  url: string; // Added for CTA
  src: {
    large: string;
    medium: string;
    small: string;
    original: string;
    landscape: string;
    portrait: string;
    tiny: string;
  };
  alt: string | null;
  photographer: string;
};

type SearchResponse = { photos: PexelsPhoto[] };

export default async function LatestGrid() {
  // Longer delay; see fallback grid first, then streamed content.
  await new Promise((r) => setTimeout(r, 2500));

  const key = process.env.PEXELS_API_KEY;
  if (!key) {
    throw new Error("Missing PEXELS_API_KEY in env");
  }

  // Use search for more descriptive alt text (nature as a friendly default)
  const res = await fetch(
    "https://api.pexels.com/v1/search?query=nature&per_page=12&page=1",
    {
      headers: { Authorization: key },
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error(`Pexels search failed: ${res.status}`);
  }

  const data = (await res.json()) as SearchResponse;
  const photos = data.photos?.slice(0, 12) || [];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((p) => {
        const title =
          (p.alt && p.alt.trim().length > 0 ? p.alt : null) ||
          `Photo by ${p.photographer}`;

        return (
          <div
            key={p.id}
            className="card glass bg-base-100/20 overflow-hidden transition hover:scale-[1.01] hover:shadow-lg"
          >
            <Link
              href={`/photo/${p.id}`}
              className="block group cursor-pointer"
            >
              <figure className="relative h-48">
                <Image
                  src={p.src.medium || p.src.large}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </figure>
            </Link>
            <div className="card-body">
              <Link
                href={`/photo/${p.id}`}
                className="hover:underline decoration-primary/60"
              >
                <h3 className="card-title text-base">{title}</h3>
              </Link>
              <div className="card-actions justify-between items-center">
                <span className="badge badge-ghost">{p.photographer}</span>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline"
                >
                  View on Pexels
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
