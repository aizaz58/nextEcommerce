"use client";

import { useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Photos({ imageList }) {
  const [selectedImage, setSelectedImage] = useState(imageList[0]);
  if (imageList?.length === 0) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-3 w-full">
     <div className="flex justify-center w-full object-contain  relative h-[350px] md:h-[430px]">
  <Zoom>
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full " // Required for fill to work
    >
      <Image
        src={selectedImage}
        alt="Selected content"
        fill
        className="object-contain"
        
      />
    </motion.div>
  </Zoom>
</div>
      <div className="flex flex-wrap justify-center items-center gap-3">
        {imageList?.map((item,i) => {
          return (
            <div
            key={i}
              onClick={() => {
                setSelectedImage(item);
              }}
              className={`aspect-[64/85] object-cover object-top  w-[80px] cursor-pointer  border-b-2 ${selectedImage === item ? "border-foreground" : "border-transparent"
                }`}
              // className="w-[80px] border rounded p-2"
            >
              
              <img className="object-cover" src={item} alt="" />
           
            </div>
          );
        })}
      </div>
    </div>
  );
}
