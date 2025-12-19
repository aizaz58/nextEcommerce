"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useProductsByIds } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { Product } from "@/lib/types/types";
import { useSearchParams } from "next/navigation";
import Checkout from "./Checkout";

interface CartItem {
  id: string;
  quantity: number;
}

interface ProductListItem {
  id: string;
  quantity: number;
  product?: Product;
}

export default function CheckoutPageClient() {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });

  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const productId = searchParams.get("productId");

  const productIdsList =
    type === "buynow"
      ? [productId]
      : data?.carts?.map((item: CartItem) => item?.id);

  const {
    data: products,
    error,
    isLoading,
  } = useProductsByIds({
    idsList: productIdsList,
  });

  if (error) {
    return <div>{error}</div>;
  }

  if (!productIdsList || productIdsList.length === 0) {
    return (
      <div>
        <h1>Products Not Found</h1>
      </div>
    );
  }

  let productList: ProductListItem[] | undefined;

  if (!isLoading) {
    productList =
      type === "buynow"
        ? productId && products && products.length > 0
          ? [
              {
                id: productId,
                quantity: 1,
                product: products[0] as Product,
              },
            ]
          : undefined
        : data?.carts?.map((item: CartItem) => {
            return {
              ...item,
              product: products?.find((e: Product) => e?.id === item?.id) as
                | Product
                | undefined,
            };
          });
  }

  if (!isLoading && (!productList || productList.length === 0)) {
    return (
      <div>
        <h1>Products Not Found</h1>
      </div>
    );
  }

  return (
    <main className="p-5 flex flex-col gap-4">
      <h1 className="text-xl">Checkout</h1>
      <Checkout
        productList={productList}
        isProductsLoading={isLoading}
        checkoutType={type === "buynow" ? "buynow" : "cart"}
      />
    </main>
  );
}


