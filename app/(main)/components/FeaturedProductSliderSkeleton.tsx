"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export default function FeaturedProductSliderSkeleton() {
  useEffect(() => {
    console.log("🔄 Skeleton loader is showing");
    return () => {
      console.log("✅ Skeleton loader hidden - content loaded");
    };
  }, []);

  return (
    <div className="slider-container flex flex-col gap-8 justify-center overflow-hidden md:p-10 p-5">
      <div className="flex flex-col-reverse md:flex-row gap-4 bg-primary-foreground p-5 md:px-24 md:py-20 w-full">
        {/* Left side - Content */}
        <div className="flex-1 flex flex-col md:gap-10 gap-4">
          <div className="flex flex-col gap-4">
            {/* Title skeleton */}
            <Skeleton className="h-8 md:h-10 w-3/4" />
            {/* Description skeleton */}
            <Skeleton className="h-4 md:h-5 w-full max-w-96" />
            <Skeleton className="h-4 md:h-5 w-2/3 max-w-96" />
          </div>
          {/* Buttons skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-24 md:w-32" />
            <Skeleton className="h-10 w-24 md:w-32" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        {/* Right side - Image */}
        <div className="">
          <Skeleton className="h-56 md:h-92 w-56 md:w-92 rounded-md" />
        </div>
      </div>
    </div>
  );
}

