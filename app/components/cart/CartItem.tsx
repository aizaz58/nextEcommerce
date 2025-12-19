"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

export type CartItemProduct = {
  id?: string;
  title?: string;
  salePrice?: number;
  price?: number;
  featureImageURL?: string;
};

export type CartItemData = {
  id: string;
  quantity: number;
  product?: CartItemProduct;
};

type CartItemProps = {
  item: CartItemData;
  currencySymbol?: string;
  onQuantityChange?: (nextQuantity: number) => Promise<void> | void;
  onRemove?: () => Promise<void> | void;
  hideQuantityControls?: boolean;
  className?: string;
};

export default function CartItem({
  item,
  currencySymbol =  "£",
  onQuantityChange,
  onRemove,
  hideQuantityControls = false,
  className = "",
}: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { product } = item;
  const quantity = item?.quantity ?? 1;

  const price = useMemo(
    () => product?.salePrice ?? product?.price ?? 0,
    [product?.price, product?.salePrice]
  );
  const lineTotal = useMemo(() => price * quantity, [price, quantity]);

  const handleUpdate = async (value: number) => {
    if (!onQuantityChange || value < 1) return;
    setIsUpdating(true);
    await onQuantityChange(value);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    if (!onRemove) return;
    setIsRemoving(true);
    await onRemove();
    setIsRemoving(false);
  };

  return (
    <div
      className={`flex gap-3 bg-card border rounded-lg p-2  ${className}`.trim()}
    >
      <div className="h-16 w-16 shrink-0 rounded-md bg-muted overflow-hidden">
        {product?.featureImageURL ? (
          <Image
            src={product.featureImageURL}
            alt={product?.title ?? "Cart item"}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-100" />
        )}
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2">
          <div>
            <p className="text-sm font-semibold">{product?.title || "..."}</p>
            <p className="text-xs text-muted-foreground">
              {currencySymbol} {price.toLocaleString("en-US")}
            </p>
          </div>
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground"
              onClick={handleRemove}
              disabled={isRemoving}
            >
              <Trash2 size={14} />
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          {hideQuantityControls || !onQuantityChange ? (
            <span className="text-sm text-muted-foreground">
              Qty: {quantity}
            </span>
          ) : (
            <div className="flex items-center gap-3">
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
          )}

          <div className="text-sm font-semibold">
            {currencySymbol} {lineTotal.toLocaleString("en-US")}
          </div>
        </div>
      </div>
    </div>
  );
}

