import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import AuthContextProvider from "@/contexts/AuthContext";
import AddToCartButton from "./AddToCartButton";
import { getProductReviewCounts } from "@/lib/firestore/products/count/read";
import { Suspense } from "react";
import MyRating from "./MyRating";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types/types";
import Image from "next/image";

export default function ProductsGridView({ products }: { products: Product[] }) {

  if (!products || products === undefined) {
    return <h4>No products</h4>
  }
  return (
    <section className="w-full flex justify-center">
      <div className="flex flex-col gap-5 max-w-[900px] p-5">
        <h1 className="text-center font-semibold text-lg">Products</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {!products && <h4>No products found.</h4>}
          {products?.map((item: Product) => {
            return <ProductCard product={item} key={item?.id} />;
          })}
        </div>
      </div>
    </section>
  );
}


export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex  flex-col  border border-muted-foreground/30 dark:border-muted-foreground/50 rounded-lg">
      {/* Wrap only the image inside the Link */}
      <Link href={`/products/${product?.id}`} className="relative w-full block">
        <Image
        height={200}
        width={100}
          src={product?.featureImageURL}
          className="rounded-lg h-56 w-full object-cover"
          alt={product?.title}
        />
        <div className="absolute top-1 right-1">
          <AuthContextProvider>
            <FavoriteButton productId={product?.id} />
          </AuthContextProvider>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-2 md:p-3">
        <div className="flex-1">

          {/* Title should be inside a Link separately */}
          <Link href={`/products/${product?.id}`} className="font-semibold line-clamp-2 text-sm">
            {product?.title}
          </Link>
        </div>

        <div>
          <h2 className="text-green-500 text-sm font-semibold">
            $ {product?.salePrice}{" "}
            <span className="line-through text-xs text-gray-600">
              $ {product?.price}
            </span>
          </h2>
        </div>

        {/* <p className="text-xs text-gray-500 line-clamp-2">
        {product?.shortDescription}
        </p> */}

        <Suspense>
          <RatingReview product={product} />
        </Suspense>

        {product?.stock <= (product?.orders ?? 0) && (
          <div className="flex">
            <h3 className="text-red-500 rounded-lg text-xs font-semibold">
              Out Of Stock
            </h3>
          </div>
        )}

        <div className="flex items-center gap-4 w-full">
          {/* <div className="w-full">
          <Link href={`/checkout?type=buynow&productId=${product?.id}`}>
          <Button>Buy Now</Button>
          </Link>
          </div> */}

          <AuthContextProvider>
            <AddToCartButton productId={product?.id} />
          </AuthContextProvider>
        </div>
      </div>
    </div>
  );
}


async function RatingReview({ product }: { product: Product }) {
  const counts = await getProductReviewCounts({ productId: product?.id });
  return (
    <div className="flex gap-1 md:gap-3 items-center">
      <MyRating  value={counts?.averageRating ?? 0} />
      <h1 className="text-xs text-muted-foreground">
        <span>{counts?.averageRating?.toFixed(1)}</span> ({counts?.totalReviews}
        )
      </h1>
    </div>
  );
}
