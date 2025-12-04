import { getProduct } from "@/lib/firestore/products/read_server";
import Photos from "./components/Photos";
import Details, { Brand, Category, type ProductDetails } from "./components/Details";
import Reviews from "./components/Reviews";
import RelatedProducts from "./components/RelatedProducts";
import AddReview from "./components/AddReiveiw";
import AuthContextProvider from "@/contexts/AuthContext";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { productId: string } }) {
  const { productId } = params;
  const product = await getProduct({ id: productId });

  return {
    title: `${product?.title} | Product`,
    description: product?.shortDescription ?? "",
    openGraph: {
      images: [product?.featureImageURL],
    },
  };
}

export default async function Page({ params }: { params: { productId: string } }) {
  const { productId } = params;
  const product = (await getProduct({ id: productId })) as ProductDetails | null;

  if (!product) {
    notFound();
  }

  const imageList: string[] = [product.featureImageURL, ...(product.imageList ?? [])].filter(
    (image): image is string => Boolean(image)
  );

  return (
    <main className="p-5 md:p-10">
      <div className="flex gap-3 pb-6">
        {product.categoryId && <Category categoryId={product.categoryId} />}
        {product.brandId && <Brand brandId={product.brandId} />}
      </div>
      <section className="flex flex-col md:flex-row gap-3">
        <Photos imageList={imageList} />
        <Details product={product} />
      </section>
      <div className="flex justify-center py-10">
        <AuthContextProvider>
          <div className="flex flex-col md:flex-row gap-4 md:max-w-[900px] w-full">
            <AddReview productId={productId} />
            <Reviews productId={productId} />
          </div>
        </AuthContextProvider>
      </div>
      {product.categoryId && (
        <RelatedProducts categoryId={product.categoryId} productId={productId} />
      )}
    </main>
  );
}
