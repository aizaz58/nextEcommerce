"use client";

import { useProductReviewCounts } from "@/lib/firestore/products/count/read_client";
import MyRating from "./MyRating";
import { Product } from "@/lib/types/types";

export default function RatingReview({ product }: { product: Product }) {
  const { data: counts, isLoading } = useProductReviewCounts({ productId: product?.id });
  
  if (isLoading) {
    return (
      <div className="flex gap-1 md:gap-3 items-center">
        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }
  
  return (
    <div className="flex gap-1 md:gap-3 items-center">
      <MyRating value={counts?.averageRating ?? 0} />
      <h1 className="text-xs text-muted-foreground">
        <span>{counts?.averageRating?.toFixed(1) ?? "0.0"}</span> ({counts?.totalReviews ?? 0}
        )
      </h1>
    </div>
  );
}

