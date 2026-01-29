export default function LoadingPhoto() {
  return (
    <section className="grid gap-8">
      <div className="flex items-center justify-between">
        <div className="breadcrumbs text-sm opacity-80">
          <ul>
            <li>Gallery</li>
            <li>Loading photo…</li>
          </ul>
        </div>
        <button className="btn btn-ghost btn-sm" disabled>
          ← Back to gallery
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
        <div className="card glass bg-base-100/20">
          <div className="skeleton h-[60vh] w-full" />
        </div>
        <div className="card glass bg-base-100/20">
          <div className="card-body space-y-4">
            <div className="skeleton h-6 w-32" />
            <div className="skeleton h-4 w-40" />
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-10 w-full" />
          </div>
        </div>
      </div>

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
    </section>
  );
}