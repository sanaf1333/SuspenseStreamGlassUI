import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

type PexelsSrc = {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
};

type PexelsPhoto = {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  avg_color: string;
  alt: string | null;
  src: PexelsSrc;
};

async function getPhoto(id: string): Promise<PexelsPhoto> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) {
    throw new Error("Missing PEXELS_API_KEY in env");
  }

  const res = await fetch(`https://api.pexels.com/v1/photos/${id}`, {
    headers: { Authorization: key },
    // Use revalidate so Next can cache + dedupe this fetch across components.
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Pexels photo(${id}) failed: ${res.status}`);
  }

  return (await res.json()) as PexelsPhoto;
}

/**
 * Hero section: big image with overlay text.
 * Short artificial delay so you can see the Suspense fallback briefly.
 */
async function PhotoHero({ id }: { id: string }) {
  await new Promise((r) => setTimeout(r, 800));
  const photo = await getPhoto(id);

  const title =
    (photo.alt && photo.alt.trim().length > 0 ? photo.alt : null) ||
    `Photo by ${photo.photographer}`;

  return (
    <div className="card glass image-full overflow-hidden">
      <figure className="relative h-[60vh] min-h-[320px]">
        <Image
          src={
            photo.src.landscape ||
            photo.src.large2x ||
            photo.src.large ||
            photo.src.original
          }
          alt={title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </figure>
      <div className="card-body justify-end bg-gradient-to-t from-black/60 via-black/10 to-transparent">
        <div className="flex flex-col gap-3 max-w-xl">
          <span className="badge badge-outline w-fit">Photo detail</span>
          <h1 className="card-title text-2xl md:text-3xl">{title}</h1>
          <p className="text-sm md:text-base opacity-80">
            High‑resolution photograph by {photo.photographer}, courtesy of
            Pexels.
          </p>
          <div className="card-actions justify-between items-center">
            <a
              href={photo.photographer_url}
              target="_blank"
              rel="noopener noreferrer"
              className="badge badge-ghost"
            >
              @{photo.photographer}
            </a>
            <a
              href={photo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm md:btn-md btn-primary"
            >
              View on Pexels
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Detail card: resolution, average color chip, ID, and download CTAs.
 * Slightly longer delay so it streams in after the hero.
 */
async function PhotoMeta({ id }: { id: string }) {
  await new Promise((r) => setTimeout(r, 1600));
  const photo = await getPhoto(id);

  const resolution = `${photo.width} × ${photo.height}`;

  return (
    <div className="card glass bg-base-100/20 backdrop-blur-md">
      <div className="card-body space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="card-title text-lg md:text-xl">Photo details</h2>
          <span className="badge badge-outline">#{photo.id}</span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="opacity-70">Photographer</span>
            <a
              href={photo.photographer_url}
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover text-sm"
            >
              {photo.photographer}
            </a>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="opacity-70">Resolution</span>
            <span className="font-medium">{resolution}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="opacity-70">Average color</span>
            <span className="inline-flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-base-300"
                style={{ backgroundColor: photo.avg_color }}
              />
              <span className="font-mono text-xs md:text-sm">
                {photo.avg_color}
              </span>
            </span>
          </div>
        </div>

        <div className="divider my-2" />

        <div className="card-actions justify-between gap-2">
          <a
            href={photo.src.original}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm md:btn-md btn-outline"
          >
            Open original
          </a>
          <a
            href={photo.src.large2x || photo.src.large || photo.src.medium}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm md:btn-md btn-secondary"
          >
            View large
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Related strip: a small horizontal scroller of additional nature photos.
 * Longest delay so you clearly see progressive enhancement.
 */
async function RelatedStrip() {
  await new Promise((r) => setTimeout(r, 2400));

  const key = process.env.PEXELS_API_KEY;
  if (!key) {
    throw new Error("Missing PEXELS_API_KEY in env");
  }

  const res = await fetch(
    "https://api.pexels.com/v1/search?query=nature&per_page=6&page=2",
    {
      headers: { Authorization: key },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Pexels related search failed: ${res.status}`);
  }

  const data = (await res.json()) as { photos: PexelsPhoto[] };
  const photos = data.photos || [];

  if (!photos.length) {
    return null;
  }

  return (
    <div className="card glass bg-base-100/20">
      <div className="card-body">
        <div className="flex items-center justify-between mb-2">
          <h2 className="card-title text-base md:text-lg">
            More nature from Pexels
          </h2>
          <span className="badge badge-outline hidden sm:inline-flex">
            Streaming demo
          </span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {photos.map((p) => {
            const title =
              (p.alt && p.alt.trim().length > 0 ? p.alt : null) ||
              `Photo by ${p.photographer}`;

            return (
              <Link
                key={p.id}
                href={`/photo/${p.id}`}
                className="min-w-[160px] max-w-[180px] card glass bg-base-100/10 overflow-hidden hover:shadow-lg transition"
              >
                <figure className="relative h-32">
                  <Image
                    src={p.src.small || p.src.medium}
                    alt={title}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </figure>
                <div className="card-body p-3">
                  <p className="text-xs line-clamp-2">{title}</p>
                  <span className="badge badge-ghost mt-2 text-[10px]">
                    {p.photographer}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section className="grid gap-8">
      <div className="flex items-center justify-between">
        <div className="breadcrumbs text-sm opacity-80">
          <ul>
            <li>
              <Link href="/">Gallery</Link>
            </li>
            <li>Photo #{id}</li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost btn-sm">
          ← Back to gallery
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
        <Suspense
          fallback={
            <div className="card glass bg-base-100/20">
              <div className="skeleton h-[60vh] w-full" />
            </div>
          }
        >
          <PhotoHero id={id} />
        </Suspense>

        <Suspense
          fallback={
            <div className="card glass bg-base-100/20">
              <div className="card-body space-y-4">
                <div className="skeleton h-6 w-32" />
                <div className="skeleton h-4 w-40" />
                <div className="skeleton h-4 w-28" />
                <div className="skeleton h-4 w-24" />
                <div className="skeleton h-10 w-full" />
              </div>
            </div>
          }
        >
          <PhotoMeta id={id} />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="card glass bg-base-100/20">
            <div className="card-body">
              <div className="skeleton h-5 w-40 mb-3" />
              <div className="flex gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="card glass bg-base-100/20 w-40">
                    <div className="skeleton h-24 w-full" />
                    <div className="card-body p-3">
                      <div className="skeleton h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <RelatedStrip />
      </Suspense>
    </section>
  );
}