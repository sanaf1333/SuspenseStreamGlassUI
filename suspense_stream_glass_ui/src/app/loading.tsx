/*
  Decision log:
  - Route-level fallback shows immediately while server components fetch.
  - DaisyUI skeletons make streaming states visually clear.
*/
export default function Loading() {
  return (
    <section className="grid gap-8">
      <div className="card glass bg-base-100/20">
        <div className="card-body">
          <div className="skeleton h-6 w-32" />
        </div>
        <div className="skeleton h-64 w-full" />
      </div>
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
    </section>
  );
}