import Link from "next/link";

import { Button } from "@/components/ui/button";
import ListView from "./components/ListView";
import ProductsTable from "./components/ProductsTable";
import Products from "./components/Products";
export const metadata = {
    title: "All products we have in store.",
}

export default function Page() {
  return (
    <main className="flex flex-col gap-4 pt-15  md:pt-0 p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl">Products</h1>
        <Link href={`/admin/products/form`}>
          <Button className=" text-sm  px-4 py-2 rounded-lg">
            Create
          </Button>
        </Link>
      </div>
      {/* <ListView /> */}
      <Products/>
    </main>
  );
}
