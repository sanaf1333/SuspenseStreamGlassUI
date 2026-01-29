/*
  Decision log:
  - Two ways to fetch Pexels in server components:
    A) Call internal API route (uniform, but extra hop).
    B) Call Pexels directly (server-only env, faster).
    -> Chose B for SSR demonstration; later CSR will use the proxy route.
  - Caching:
    A) 'next: { revalidate }' shows ISR-like behavior.
    B) 'no-store' forces fresh fetch every request.
    -> Chose A here for teaching ISR.
*/
import Image from "next/image";

type PexelsPhoto = {
  id: number;
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

type CuratedResponse = { photos: PexelsPhoto[] };

export default async function CuratedHero() {
  // Short delay to illustrate streaming; the fallback renders first.
  await new Promise((r) => setTimeout(r, 1200));

  const key = process.env.PEXELS_API_KEY;
  if (!key) {
    throw new Error("Missing PEXELS_API_KEY in env");
  }

  const res = await fetch("https://api.pexels.com/v1/curated?per_page=4", {
    headers: { Authorization: key },
    next: { revalidate: 300 }, // cache for 5 minutes
  });

  if (!res.ok) {
    throw new Error(`Pexels curated failed: ${res.status}`);
  }

  const data = (await res.json()) as CuratedResponse;
  const photo = data.photos?.[0];

  if (!photo) {
    return (
      <div className="alert alert-info">
        No curated photo found. Try again later.
      </div>
    );
  }

  return (
    // Decision: Use DaisyUI 'card image-full' for a proper hero layout with overlay text
    <div className="card glass image-full overflow-hidden">
      <figure className="relative h-64 sm:h-80">
        <Image
          src={photo.src.landscape || photo.src.large}
          alt={photo.alt || "Featured photo"}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          priority
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">Featured</h2>
        <p className="text-sm opacity-80">{photo.alt || "Untitled"}</p>
        <div className="card-actions justify-end">
          <span className="badge badge-outline">
            Photographer: {photo.photographer}
          </span>
        </div>
      </div>
    </div>
  );
}