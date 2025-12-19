"use client";

import { Skeleton } from "@/components/ui/skeleton";
import CheckoutProductsSkeleton from "./CheckoutProductsSkeleton";

export default function CheckoutSkeleton() {
  return (
    <main className="p-5 flex flex-col gap-4">
      <h1 className="text-xl">Checkout</h1>
      <section className="flex flex-col md:flex-row gap-3">
        {/* Shipping address */}
        <section className="flex-1 flex flex-col gap-4 border rounded-xl p-4">
          <h2 className="text-xl">Shipping Address</h2>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </section>

        <CheckoutProductsSkeleton />
      </section>
    </main>
  );
}




