import CuratedHero from "@/components/CuratedHero";
import LatestGridClient from "@/components/LatestGridClient";
import { Suspense } from "react";
/* 
  Decision log:
  - Two ways to demonstrate streaming:
    A) Single Suspense boundary (simpler but less illustrative).
    B) Nested boundaries with different delays to visualize progressive streaming.
    -> Chose B: Hero (fast) + Grid (slower) to see fallbacks replace progressively.
*/

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const q = (params?.query || "nature").trim() || "nature";
  const quickQueries = ["nature", "ocean", "city", "mountains", "night"];

  return (
    <section className="grid gap-8">
      <div className="card glass bg-base-100/20 overflow-hidden neon-shell">
        <div className="card-body gap-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="badge badge-outline mb-3">Live Gallery</div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight neon-title">
                Discover Cinematic Photo Streams
              </h1>
              <p className="mt-2 text-sm sm:text-base opacity-80 max-w-2xl">
                Search and explore high-quality photos with a glassmorphism UI,
                streaming sections, and smooth infinite loading.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="status-dot" />
              <span className="text-xs uppercase tracking-wider opacity-80">
                Live
              </span>
            </div>
          </div>

          {/* DaisyUI pill search (glass, rounded, icon) */}
          <form
            action="/"
            method="GET"
            className="join rounded-full shadow-md w-full sm:w-fit"
          >
            <input
              name="query"
              defaultValue={q}
              placeholder="Search photos..."
              className="input input-bordered glass join-item rounded-l-full w-full sm:w-72 bg-base-100/60 placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="submit"
              className="btn btn-accent join-item rounded-r-full gap-2 shadow-md"
              aria-label="Search"
              title="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                <circle cx="10" cy="10" r="7" />
              </svg>
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {quickQueries.map((tag) => (
              <a
                key={tag}
                href={`/?query=${encodeURIComponent(tag)}`}
                className={`badge badge-lg cursor-pointer transition hover:scale-105 ${
                  q.toLowerCase() === tag ? "badge-primary" : "badge-ghost"
                }`}
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Featured + Latest Results</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card glass bg-base-100/20">
          <div className="card-body py-4">
            <p className="text-xs uppercase opacity-70">Mode</p>
            <p className="text-lg font-semibold">Streaming SSR + CSR</p>
          </div>
        </div>
        <div className="card glass bg-base-100/20">
          <div className="card-body py-4">
            <p className="text-xs uppercase opacity-70">Theme</p>
            <p className="text-lg font-semibold">Glasslight / Glassdark</p>
          </div>
        </div>
        <div className="card glass bg-base-100/20">
          <div className="card-body py-4">
            <p className="text-xs uppercase opacity-70">Current Query</p>
            <p className="text-lg font-semibold truncate">{q}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Featured</h2>
      </div>

      <div className="hero-float">
        {/* Server-rendered hero (streams) */}
        <CuratedHero />
      </div>

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Latest Results</h2>
      </div>

      {/* Client grid (CSR) with infinite scroll. Suspense for initial skeletons. */}
      <Suspense
        fallback={
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card glass bg-base-100/20">
                <div className="skeleton h-48 w-full" />
                <div className="card-body">
                  <div className="skeleton h-4 w-24" />
                  <div className="skeleton h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        }
      >
        <LatestGridClient query={q} />
      </Suspense>
    </section>
  );
}
