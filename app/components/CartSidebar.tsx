"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useProductsByIds } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@nextui-org/react";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { Product } from "@/lib/types/types";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

type CartUserItem = {
  id: string;
  quantity: number;
  product?: {
    id: string;
    title: string;
    salePrice?: number;
    price?: number;
    featureImageURL?: string;
  };
};

export default function CartSidebar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useUser({ uid: user?.uid });
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const cartItems = (data?.carts ?? []) as CartUserItem[];
  const cartIds = useMemo(() => cartItems.map((item) => item?.id), [cartItems]);

  const {
    data: products,
    isLoading: isProductsLoading,
  } = useProductsByIds({
    idsList: cartIds,
  });

  const mergedItems = useMemo(
    () =>
      cartItems.map((item) => ({
        ...item,
        product: products?.find((product:Product) => product?.id === item?.id),
      })),
    [cartItems, products]
  );

  const subtotal = useMemo(() => {
    return mergedItems.reduce((total, item) => {
      const price = item?.product?.salePrice ?? item?.product?.price ?? 0;
      return total + price * (item?.quantity ?? 1);
    }, 0);
  }, [mergedItems]);

  const handleQuantityChange = useCallback(
    async (productId: string, nextQuantity: number) => {
      if (!user?.uid) {
        toast.error("Please login to update cart");
        return;
      }
      if (nextQuantity < 1) return;
      try {
        const newList = cartItems.map((item) =>
          item?.id === productId
            ? { ...item, quantity: parseInt(String(nextQuantity)) }
            : item
        );
        await updateCarts({ list: newList, uid: user.uid });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to update cart";
        toast.error(message);
      }
    },
    [cartItems, user?.uid]
  );

  const handleRemove = useCallback(
    async (productId: string) => {
      if (!user?.uid) {
        toast.error("Please login to update cart");
        return;
      }
      try {
        const newList = cartItems.filter((item) => item?.id !== productId);
        await updateCarts({ list: newList, uid: user.uid });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to remove item";
        toast.error(message);
      }
    },
    [cartItems, user?.uid]
  );

  const cartCount = cartItems.length;
  const formattedSubtotal = subtotal.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

  const search = searchParams.toString();
  const currentPath = `${pathname}${search ? `?${search}` : ""}`;
  const loginHref = `/login?redirect=${encodeURIComponent(currentPath)}`;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="relative inline-flex">
          <Button
            title="My Cart"
            size={"icon"}
            variant={"ghost"}
            className="h-8 w-8 flex justify-center items-center rounded-full"
            type="button"
          >
            <ShoppingCart size={14} />
          </Button>
          {cartCount > 0 && (
            <Badge
              variant="solid"
              size="sm"
              className="absolute -top-1 -right-1 text-primary-foreground bg-primary flex items-center justify-center font-semibold text-[10px] pointer-events-none"
              content={cartCount}
            >
              <span />
            </Badge>
          )}
        </div>
      </SheetTrigger>
      <SheetContent
        side="right"
             >
        <SheetHeader className="border-b px-6 py-4 text-left">
          <SheetTitle className="text-xl tracking-wide uppercase">
            Cart
          </SheetTitle>
          <p className="text-xs text-muted-foreground">
            {cartCount} {cartCount === 1 ? "item" : "items"}
          </p>
        </SheetHeader>

        {!user && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm text-muted-foreground">
              Please log in to view your cart.
            </p>
            <Button asChild className="w-full">
              <Link href={loginHref} onClick={() => setOpen(false)}>
                Login
              </Link>
            </Button>
          </div>
        )}

        {user && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {(isLoading || isProductsLoading) && (
                <div className="text-sm text-muted-foreground">
                  Loading your cart...
                </div>
              )}

              {!isLoading &&
                !isProductsLoading &&
                mergedItems.length === 0 && (
                  <div className="flex flex-col items-center gap-3 text-center text-sm text-muted-foreground py-10">
                    <img
                      src="/svgs/Empty-pana.svg"
                      alt="Empty cart illustration"
                      className="h-32"
                    />
                    <p>Your cart is empty</p>
                  </div>
                )}

              {mergedItems.map((item) => (
                <CartItem
                  key={item?.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </>
        )}
<SheetFooter>

            <div className="border-t px-6 py-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-semibold">
                 £ {formattedSubtotal || 0}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping, taxes, and discount codes calculated at checkout.
              </p>
              <Button
                asChild
                className="w-full rounded-full uppercase tracking-wide"
                disabled={mergedItems.length === 0}
              >
                <Link
                  href="/checkout?type=cart"
                  onClick={() => setOpen(false)}
                  >
                  Check Out
                </Link>
              </Button>
            </div>
                  </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

interface CartItemProps {
  item: CartUserItem;
  onQuantityChange: (productId: string, quantity: number) => Promise<void> | void;
  onRemove: (productId: string) => Promise<void> | void;
}

function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { product } = item;
  const quantity = item?.quantity ?? 1;

  const price = product?.salePrice ?? product?.price ?? 0;
  const formattedPrice = price.toLocaleString("en-PK", {
    maximumFractionDigits: 0,
  });

  const handleUpdate = async (value: number) => {
    setIsUpdating(true);
    await onQuantityChange(item?.id, value);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove(item?.id);
    setIsRemoving(false);
  };

  return (
    <div className="flex gap-3 border-b pb-4 last:border-b-0">
      <div className="h-20 w-20 shrink-0 rounded-md bg-muted">
        {product?.featureImageURL && (
          <Image
          width={20}
          height={20}
            src={product?.featureImageURL}
            alt={product?.title ?? "Cart item"}
            className="h-full w-full object-cover rounded-md"
          />
        )}
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold">{product?.title || "..."}</p>
            <p className="text-sm font-semibold mt-1">£ {formattedPrice}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            <Trash2 size={14} />
          </Button>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleUpdate(quantity - 1)}
            disabled={isUpdating || quantity <= 1}
          >
            <Minus size={12} />
          </Button>
          <span className="text-sm">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleUpdate(quantity + 1)}
            disabled={isUpdating}
          >
            <Plus size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}

