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

  return (
    <section className="grid gap-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">SSR Streaming Demo</h1>
        {/* DaisyUI pill search (glass, rounded, icon) */}
        <form action="/" method="GET" className="join rounded-full shadow-md">
          <input
            name="query"
            defaultValue={q}
            placeholder="Search photos…"
            className="input input-bordered glass join-item rounded-l-full w-48 sm:w-72 bg-base-100/60 placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary/40"
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
      </div>

      {/* Server-rendered hero (streams) */}
      <CuratedHero />
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
