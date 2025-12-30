export default function GaleriLoading() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container mx-auto px-4 pb-24 pt-16">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-3 h-6 w-40 animate-pulse rounded-full bg-burgundy-100" />
          <div className="mb-6 h-12 w-64 animate-pulse rounded-lg bg-burgundy-100" />
          <div className="h-6 w-96 max-w-full animate-pulse rounded-lg bg-burgundy-100" />
        </div>

        <div className="mb-12 flex justify-center gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 w-28 animate-pulse rounded-full bg-burgundy-100" />
          ))}
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-3xl bg-burgundy-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
