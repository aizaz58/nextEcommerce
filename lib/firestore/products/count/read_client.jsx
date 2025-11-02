"use client";

import { db } from "@/lib/firebase";
import {
  average,
  collection,
  count,
  getAggregateFromServer,
  getCountFromServer,
} from "firebase/firestore";
import useSWR from "swr";

export const getProductsCount = async () => {
  const ref = collection(db, `products`);
  const data = await getCountFromServer(ref);
  return data.data().count;
};

export function useProductCount() {
  const { data, error, isLoading } = useSWR("products_count", (key) =>
    getProductsCount()
  );
  if (error) {
    console.log(error?.message);
  }
  return { data, error, isLoading };
}

export const getProductReviewCounts = async ({ productId }) => {
  const ref = collection(db, `products/${productId}/reviews`);
  const data = await getAggregateFromServer(ref, {
    totalReviews: count(),
    averageRating: average("rating"),
  });
  return data.data();
};

export function useProductReviewCounts({ productId }) {
  const { data, error, isLoading } = useSWR(
    productId ? [`product_review_counts`, productId] : null,
    ([key, productId]) => getProductReviewCounts({ productId })
  );
  if (error) {
    console.log(error?.message);
  }
  return { data, error, isLoading };
}