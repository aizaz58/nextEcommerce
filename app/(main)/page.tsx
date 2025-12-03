import FeaturedProductSlider from "@/app/components/Sliders";
import Categories from "@/app/components/Categories";
import CustomerReviews from "@/app/components/CustomerReviews";
import ProductsGridView from "@/app/components/Products";
import { getCategories } from "@/lib/firestore/categories/read_server";
import FeaturedProductSliderSkeleton from "./components/FeaturedProductSliderSkeleton";
import CategoriesSkeleton from "./components/CategoriesSkeleton";
import ProductsSkeleton from "./components/ProductsSkeleton";
import { Suspense } from "react";
import {
  getFeaturedProducts,
  getProducts,
} from "@/lib/firestore/products/read_server";

export const dynamic = "force-dynamic";

export default async function Home() {
  
  const featuredProducts = getFeaturedProducts();
  const categories = getCategories();
  const products = getProducts();

  return (
    <main className="w-screen overflow-x-hidden">
      <Suspense fallback={<FeaturedProductSliderSkeleton />}>
        <FeaturedProductSlider featuredProducts={featuredProducts} />
      </Suspense>
      <Suspense fallback={<CategoriesSkeleton />}>
        <Categories categories={categories} />
      </Suspense>
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsGridView products={products} />
      </Suspense>
      <CustomerReviews />
      {/* <Brands brands={brands} /> */}
    </main>
  );
}



