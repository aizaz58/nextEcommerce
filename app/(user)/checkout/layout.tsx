"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState, useRef } from "react";
import CheckoutSkeleton from "./components/CheckoutSkeleton";

// Helper to check sessionStorage synchronously on client side
function getCheckoutCompletedFlag(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem("checkout_completed") === "true";
  } catch {
    return false;
  }
}

export default function Layout({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const productId = searchParams.get("productId");

  const { user } = useAuth();
  const { data, error, isLoading } = useUser({ uid: user?.uid });
  
  // Track previous cart length to detect when cart is cleared
  const previousCartLengthRef = useRef<number | null>(null);
  const [showSkeletonForTransition, setShowSkeletonForTransition] = useState(false);
  
  // Initialize from sessionStorage immediately
  const [checkoutJustCompleted, setCheckoutJustCompleted] = useState(() => 
    getCheckoutCompletedFlag()
  );

  // Track cart length changes
  const currentCartLength = data?.carts?.length ?? 0;
  
  useEffect(() => {
    // If we had items before and now cart is empty, and we're not loading, it might be cleared after checkout
    if (
      previousCartLengthRef.current !== null &&
      previousCartLengthRef.current > 0 &&
      currentCartLength === 0 &&
      !isLoading &&
      type === "cart"
    ) {
      // Show skeleton briefly to avoid showing "Your Cart Is Empty" immediately
      setShowSkeletonForTransition(true);
      const timer = setTimeout(() => {
        setShowSkeletonForTransition(false);
      }, 800);
      return () => clearTimeout(timer);
    }
    
    // Update previous cart length after a small delay to avoid race conditions
    const updateTimer = setTimeout(() => {
      previousCartLengthRef.current = currentCartLength;
    }, 100);
    
    return () => clearTimeout(updateTimer);
  }, [currentCartLength, isLoading, type]);

  // Clear the sessionStorage flag after a delay if it was set
  useEffect(() => {
    if (checkoutJustCompleted) {
      const timer = setTimeout(() => {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("checkout_completed");
        }
        setCheckoutJustCompleted(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [checkoutJustCompleted]);

  if (error) {
    return <div>{error}</div>;
  }

  // Check sessionStorage directly as well
  const isCheckoutCompleted = checkoutJustCompleted || getCheckoutCompletedFlag();
  const shouldShowSkeleton = isLoading || isCheckoutCompleted || showSkeletonForTransition;

  if (shouldShowSkeleton) {
    // Show skeleton while user/cart data (and downstream product fetch) are loading
    // Also show skeleton when cart is cleared after checkout completion
    return <CheckoutSkeleton />;
  }

  if (type === "cart" && (!data?.carts || data?.carts?.length === 0)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h2>Your Cart Is Empty</h2>
      </div>
    );
  }
  if (type === "buynow" && !productId) {
    return (
      <div>
        <h2>Product Not Found!</h2>
      </div>
    );
  }

  return <>{children}</>;
}
