import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <main className="p-5 md:p-10">
      {/* Top badges skeleton (Category / Brand) */}
      <div className="flex gap-3 pb-6">
        <Skeleton className="h-7 w-28 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      <section className="flex flex-col md:flex-row gap-3">
        {/* Photos skeleton */}
        <div className="flex flex-col gap-3 w-full md:w-1/2">
          <div className="flex justify-center w-full relative h-[350px] md:h-[430px]">
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
          <div className="flex flex-wrap justify-center items-center gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-64/85 w-20 rounded-md"
              />
            ))}
          </div>
        </div>

        {/* Details skeleton */}
        <div className="w-full md:w-1/2 flex flex-col gap-3">
          <Skeleton className="h-8 md:h-10 w-3/4" />{/* Title */}
          <Skeleton className="h-4 w-32" />{/* Rating / reviews */}
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-4 w-2/3 max-w-md" />{/* Short description */}

          <Skeleton className="h-6 w-40" />{/* Price */}

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Skeleton className="h-9 w-28 rounded-lg" />{/* Buy now */}
            <Skeleton className="h-9 w-28 rounded-lg" />{/* Add to cart */}
            <Skeleton className="h-9 w-9 rounded-full" />{/* Favorite */}
          </div>

          <div className="flex flex-col gap-2 py-4">
            <Skeleton className="h-4 w-full max-w-lg" />
            <Skeleton className="h-4 w-5/6 max-w-lg" />
            <Skeleton className="h-4 w-2/3 max-w-lg" />
          </div>
        </div>
      </section>

      {/* Reviews + Add review skeleton */}
      <div className="flex justify-center py-10">
        <div className="flex flex-col md:flex-row gap-4 md:max-w-[900px] w-full">
          <Skeleton className="h-40 w-full md:w-1/2 rounded-xl" />
          <Skeleton className="h-40 w-full md:w-1/2 rounded-xl" />
        </div>
      </div>

      {/* Related products skeleton */}
      <div className="mt-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </main>
  );
}


