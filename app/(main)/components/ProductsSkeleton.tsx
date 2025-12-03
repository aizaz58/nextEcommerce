"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export default function ProductsSkeleton() {
  useEffect(() => {
    console.log("🔄 Products skeleton loader is showing");
    return () => {
      console.log("✅ Products skeleton loader hidden - content loaded");
    };
  }, []);

  return (
    <section className="w-full flex justify-center">
      <div className="flex flex-col gap-5 max-w-[900px] p-5">
        <Skeleton className="h-7 w-32 mx-auto" />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col shadow-xl border border-muted-foreground/30 dark:border-muted-foreground/50 rounded-lg overflow-hidden"
            >
              {/* Image skeleton */}
              <Skeleton className="w-full aspect-[130/207]" />
              <div className="flex flex-1 flex-col gap-3 p-2 md:p-3">
                {/* Title skeleton */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                {/* Price skeleton */}
                <Skeleton className="h-5 w-24" />
                {/* Rating skeleton */}
                <Skeleton className="h-4 w-20" />
                {/* Button skeleton */}
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

