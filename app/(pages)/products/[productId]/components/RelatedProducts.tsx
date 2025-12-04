import { ProductCard } from "@/app/components/Products";
import { getProductsByCategory } from "@/lib/firestore/products/read_server";
import type { Product } from "@/lib/types/types";

type RelatedProductsProps = {
  categoryId: string;
  productId: string;
};

export default async function RelatedProducts({
  categoryId,
  productId,
}: RelatedProductsProps) {
  const products = await getProductsByCategory({
    categoryId,
    excludeId: productId,
  });

  if (!products || products.length === 0) return null;

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col gap-5 max-w-[900px] p-5">
        <h1 className="text-center font-semibold text-lg">Related Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((item) => (
            <ProductCard product={item} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
