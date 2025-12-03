"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";
import { use } from "react";
import { DocumentData } from "firebase/firestore";

export interface Category {
  id: string;
  name: string;
  imageURL: string;
  // Allow extra fields without breaking typing
  [key: string]: unknown;
}

interface CategoriesProps {
  categories: Promise<DocumentData[]>;
}

export default function Categories({ categories }: CategoriesProps) {
  // React experimental `use()` to unwrap the promise from the server component
  const categoriesData = use(categories) as Category[];
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 15000,
    cssEase: "linear",
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  if (!categoriesData || categoriesData.length === 0) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-8 justify-center overflow-hidden md:p-10 p-5">
      <div className="flex justify-center w-full">
        <h1 className="text-lg font-semibold">Shop By Category</h1>
      </div>
      <div className="category-slider">

      <Slider className="" {...settings}>
        {(categoriesData?.length <= 2
          ? [...categoriesData, ...categoriesData, ...categoriesData]
          : categoriesData
        )?.map((category,i) => {
          return (
            <Link key={i} href={`/categories/${category?.id}`}>
              <div className="px-2">
                <div className="flex flex-col gap-2 items-center justify-center">
                  <div className="md:h-32 md:w-32 h-24 w-24 rounded-full   border overflow-hidden">
                    <Image width={70} height={70} src={category?.imageURL} className="w-full rounded-full bg-cover h-full" alt="" />
                  
                  </div>
                  <h1 className="font-semibold">{category?.name}</h1>
                </div>
              </div>
            </Link>
          );
        })}
      </Slider>
        </div>
    </div>
  );
}
