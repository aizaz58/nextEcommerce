"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";
import Slider from "react-slick";
import FavoriteButton from "./FavoriteButton";
import AuthContextProvider from "@/contexts/AuthContext";
import AddToCartButton from "./AddToCartButton";
import { Product } from "@/lib/types/types";

export default function FeaturedProductSlider({ featuredProducts }:{featuredProducts:Product[]}) {
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div  className="flex flex-col gap-8 justify-center overflow-hidden md:p-10 p-5">
      <Slider {...settings}>
        {featuredProducts?.map((product,i) => {
          return (
            <div key={i}>
              <div className="flex flex-col-reverse md:flex-row gap-4 bg-[#f8f8f8] p-5 md:px-24 md:py-20 w-full">
                <div className="flex-1 flex flex-col md:gap-10 gap-4">
                  
                  <div className="flex flex-col gap-4">
                    <Link href={`/products/${product?.id}`}>
                      <h1 className="md:text-4xl text-xl font-semibold">
                        {product?.title}
                      </h1>
                    </Link>
                    <h1 className="text-gray-600 md:text-sm text-xs max-w-96 line-clamp-2">
                      {product?.shortDescription}
                    </h1>
                  </div>
                  <AuthContextProvider>
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/checkout?type=buynow&productId=${product?.id}`}
                      >
                        <Button >
                          BUY NOW
                        </Button>
                      </Link>
                      <AddToCartButton productId={product?.id} type={"large"} />
                      <FavoriteButton productId={product?.id} />
                    </div>
                  </AuthContextProvider>
                </div>
                <div className="">
                  <Link href={`/products/${product?.id}`}>
                    <img
                      className="h-[14rem] md:h-[23rem]"
                      src={product?.featureImageURL}
                      alt=""
                    />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
