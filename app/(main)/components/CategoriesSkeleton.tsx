"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export default function CategoriesSkeleton() {
  useEffect(() => {
    console.log("🔄 Categories skeleton loader is showing");
    return () => {
      console.log("✅ Categories skeleton loader hidden - content loaded");
    };
  }, []);

  return (
    <div className="flex flex-col gap-8 justify-center overflow-hidden md:p-10 p-5">
      <div className="flex justify-center w-full">
        <Skeleton className="h-7 w-48" />
      </div>
      <div className="category-slider">
        <div className="flex gap-4 px-2">
          {/* Show 5 skeleton items for desktop */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 items-center justify-center px-2">
              <Skeleton className="md:h-32 md:w-32 h-24 w-24 rounded-full" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

