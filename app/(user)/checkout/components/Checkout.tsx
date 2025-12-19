"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  createCheckoutAndGetURL,
  createCheckoutCODAndGetId,
} from "@/lib/firestore/checkout/write";
import { updateCarts } from "@/lib/firestore/user/write";
import { Product } from "@/lib/types/types";
import { Button } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import CartItem from "@/app/components/cart/CartItem";
import AddressForm, { Address, addressSchema } from "./AddressForm";
import CheckoutProductsSkeleton from "./CheckoutProductsSkeleton";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductListItem {
  id: string;
  quantity: number;
  product?: Product;
}

interface CheckoutProps {
  productList?: ProductListItem[];
  isProductsLoading?: boolean;
  checkoutType?: "cart" | "buynow" | null;
}

export default function Checkout({
  productList,
  isProductsLoading,
  checkoutType = "cart",
}: CheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"prepaid" | "cod">("cod");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const addressForm = useForm<Address>({
    defaultValues: {
      fullName: "",
      mobile: "",
      email: user?.email ?? "",
      addressLine1: "",
      addressLine2: "",
      pincode: "",
      city: "",
      state: "",
      orderNote: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(addressSchema),
  });

  useEffect(() => {
    if (user?.email) {
      addressForm.setValue("email", user.email);
    }
    if (user?.displayName) {
      addressForm.setValue("fullName", user.displayName);
    }
  }, [addressForm, user?.displayName, user?.email]);

  const totalPrice = productList?.reduce((prev: number, curr: ProductListItem) => {
    return prev + (curr?.quantity ?? 0) * (curr?.product?.salePrice ?? 0);
  }, 0) ?? 0;

  const handlePlaceOrder = addressForm.handleSubmit(
    async (addressValues: Address) => {
      if (!agreeTerms) {
        toast.error("Please agree to the terms & conditions before placing your order.");
        return;
      }

      setIsLoading(true);
      try {
        if (totalPrice <= 0) {
          throw new Error("Price should be greater than 0");
        }

        if (!productList || productList?.length === 0) {
          throw new Error("Product List Is Empty");
        }

        if (paymentMode === "prepaid") {
          const url = await createCheckoutAndGetURL({
            uid: user?.uid,
            products: productList,
            address: addressValues,
          });

          // Mark checkout as completed in sessionStorage BEFORE any operations
          if (checkoutType === "cart") {
            if (typeof window !== "undefined") {
              sessionStorage.setItem("checkout_completed", "true");
            }
          }
          
          // Navigate first to avoid layout re-render with empty cart
          router.push(url);
          
          // Clear cart items after navigation starts (fire and forget)
          if (checkoutType === "cart" && user?.uid) {
            // Use setTimeout to ensure navigation happens first
            setTimeout(() => {
              updateCarts({ uid: user.uid, list: [] }).catch(console.error);
            }, 0);
          }
        } else {
          const checkoutId = await createCheckoutCODAndGetId({
            uid: user?.uid,
            products: productList,
            address: addressValues,
          });
          
          // Mark checkout as completed in sessionStorage BEFORE any operations
          if (checkoutType === "cart") {
            if (typeof window !== "undefined") {
              sessionStorage.setItem("checkout_completed", "true");
            }
          }
          
          // Navigate first to avoid layout re-render with empty cart
          router.push(`/checkout-cod?checkout_id=${checkoutId}`);
          
          // Clear cart items after navigation starts (fire and forget)
          if (checkoutType === "cart" && user?.uid) {
            // Use setTimeout to ensure navigation happens first
            setTimeout(() => {
              updateCarts({ uid: user.uid, list: [] }).catch(console.error);
            }, 0);
          }
          
          toast.success("Successfully Placed!");
          confetti();
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "An error occurred";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    }
  );

  return (
    <section className="flex flex-col md:flex-row  gap-3">
      <AddressForm form={addressForm} />
      {isProductsLoading ? (
        <CheckoutProductsSkeleton />
      ) : (
        <div className="flex-1 flex flex-col gap-3">
          <section className="flex flex-col gap-3 border rounded-xl p-4">
            <h1 className="text-xl">Products</h1>
            <div className="flex flex-col gap-2">
              {productList?.map((item: ProductListItem, i: number) => {
                return (
                  <CartItem
                    key={item.id ?? i}
                    item={item}
                    currencySymbol="£"
                    hideQuantityControls
                  />
                );
              })}
            </div>
            <div className="flex justify-between w-full items-center p-2 font-semibold">
              <h1>Total</h1>
              <h1>£ {totalPrice}</h1>
            </div>
          </section>
          <section className="flex flex-col gap-3 border rounded-xl p-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <h2 className="text-xl">Payment Mode</h2>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <Checkbox
                    checked={paymentMode === "prepaid"}
                    onCheckedChange={(val: boolean | "indeterminate") => {
                      if (val === true) setPaymentMode("prepaid");
                    }}
                  />
                  <span>Prepaid</span>
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <Checkbox
                    checked={paymentMode === "cod"}
                    onCheckedChange={(val: boolean | "indeterminate") => {
                      if (val === true) setPaymentMode("cod");
                    }}
                  />
                  <span>Cash On Delivery</span>
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={agreeTerms}
                onCheckedChange={(val: boolean | "indeterminate") =>
                  setAgreeTerms(val === true)
                }
              />
              <h4 className="text-xs ">
                I agree with the{" "}
                <span className="text-yellow-400">terms & conditions</span>
              </h4>
            </div>
            <Button
              isLoading={isLoading}
              isDisabled={isLoading|| totalPrice<=0}
              onClick={handlePlaceOrder}
              className="bg-black text-white"
            >
              Place Order
            </Button>
          </section>
        </div>
      )}
    </section>
  );
}
