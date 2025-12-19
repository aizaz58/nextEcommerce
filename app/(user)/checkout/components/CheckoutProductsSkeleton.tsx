"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutProductsSkeleton() {
  return (
    <div className="flex-1 flex flex-col gap-3">
      {/* Products list + total */}
      <section className="flex flex-col gap-3 border rounded-xl p-4">
        <h1 className="text-xl">Products</h1>
        <div className="flex flex-col gap-2">
          {[1, 2, 3,4].map((key) => (
            <div
              key={key}
              className="flex gap-3 items-center border rounded-lg p-2"
            >
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
        <div className="flex justify-between w-full items-center p-2 font-semibold">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </section>

      {/* Payment section */}
      <section className="flex flex-col gap-3 border rounded-xl p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <h2 className="text-xl">Payment Mode</h2>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-10 w-full" />
      </section>
    </div>
  );
}

