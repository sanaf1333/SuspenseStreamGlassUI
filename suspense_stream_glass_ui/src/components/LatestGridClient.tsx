"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type PexelsPhoto = {
  id: number;
  url: string;
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

const PAGE_SIZE = 6;

export default function LatestGridClient({ query }: { query: string }) {
  const [items, setItems] = useState<PexelsPhoto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const seenRef = useRef<Set<number>>(new Set());

  const fetchPage = async (nextPage: number) => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);

    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    try {
      const res = await fetch(
        `/api/pexels?resource=search&query=${encodeURIComponent(
          query
        )}&per_page=${PAGE_SIZE}&page=${nextPage}`,
        {
          signal: controllerRef.current.signal,
          cache: "no-store",
        }
      );
      if (!res.ok) throw new Error(`Upstream ${res.status}`);

      const data = (await res.json()) as SearchResponse;
      const newPhotos = (data.photos || []).filter((p) => {
        if (seenRef.current.has(p.id)) return false;
        seenRef.current.add(p.id);
        return true;
      });

      setItems((prev) => [...prev, ...newPhotos]);

      if (newPhotos.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        setPage(nextPage + 1);
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        setError(err?.message || "Failed to load");
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset when query changes
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    seenRef.current.clear();
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading && hasMore) {
          fetchPage(page);
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [page, loading, hasMore, query]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => {
        const title =
          (p.alt && p.alt.trim().length > 0 ? p.alt : null) ||
          `Photo by ${p.photographer}`;

        return (
          <div
            key={p.id}
            className="card glass bg-base-100/20 overflow-hidden transition hover:scale-[1.01] hover:shadow-lg"
          >
            <Link href={`/photo/${p.id}`} className="block group cursor-pointer">
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

      {/* Loading placeholders (match PAGE_SIZE) */}
      {loading &&
        Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <div key={`sk-${i}`} className="card glass bg-base-100/20">
            <div className="skeleton h-48 w-full" />
            <div className="card-body">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}

      {/* Sentinel to trigger more loads */}
      <div ref={loaderRef} className="h-4 w-full col-span-full" />

      {/* Error / end states */}
      {error && (
        <div className="alert alert-error glass col-span-full">
          <span>{error}</span>
        </div>
      )}
      {!loading && !hasMore && items.length > 0 && (
        <div className="alert glass col-span-full">
          <span>End of results</span>
        </div>
      )}
    </div>
  );
}