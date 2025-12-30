export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square w-full animate-pulse rounded-xl bg-burgundy-100" />
          
          <div className="space-y-4">
            <div className="h-8 w-24 animate-pulse rounded-full bg-burgundy-100" />
            <div className="h-10 w-3/4 animate-pulse rounded-lg bg-burgundy-100" />
            <div className="h-24 w-full animate-pulse rounded-lg bg-burgundy-100" />
            <div className="h-14 w-48 animate-pulse rounded-full bg-burgundy-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
