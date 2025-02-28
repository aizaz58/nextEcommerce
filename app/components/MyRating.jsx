"use client";

import { Rating } from "@mui/material";
import { useEffect, useState } from "react";
import { Star, StarBorder } from "@mui/icons-material";
export default function MyRating({ value }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
  }, []);
  if (!visible) {
    return <></>;
  }
  return (
    <Rating
    className="text-sm md:text-xl"
    emptyIcon={<StarBorder  sx={{
      color: "#9CA3AF",
      fontSize: { xs: "14px", sm: "20px", md: "20px" }, // Adjust sizes per screen
    }} />} // Light gray color
      name="product-rating"
      defaultValue={value}
      precision={0.5}
      readOnly
    />
  );
}
