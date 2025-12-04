"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { addReview } from "@/lib/firestore/reviews/write";
import { useUser } from "@/lib/firestore/user/read";
import { Rating } from "@mui/material";

import { useState, type ChangeEvent } from "react";
import toast from "react-hot-toast";

type AddReviewProps = {
  productId: string;
};

export default function AddReview({ productId }: AddReviewProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(4);
  const [message, setMessage] = useState<string>("");
  const { user } = useAuth();
  const { data: userData } = useUser({ uid: user?.uid });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("Please Logged In First");
      }
      await addReview({
        displayName: userData?.displayName,
        message: message,
        photoURL: userData?.photoURL,
        productId: productId,
        rating: rating,
        uid: user?.uid,
      });
      setMessage("");
      toast.success("Successfully Submitted");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to submit review");
      }
    }
    setIsLoading(false);
  };

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="flex flex-col gap-3 p-3 rounded-xl border w-full">
      <h1 className="text-lg font-semibold">Rate This Product</h1>
      <Rating
        value={rating}
        onChange={(_event, newValue) => {
          if (typeof newValue === "number") {
            setRating(newValue);
          }
        }}
      />
      <textarea
        value={message}
        onChange={handleMessageChange}
        placeholder="Enter you thoughts on this products ..."
        className="w-full border border-lg px-4 py-2 focus:outline-none"
      />
      <Button
        onClick={handleSubmit}
        isLoading={isLoading}
        isDisabled={isLoading||message.length<5}
      >
        Submit
      </Button>
    </div>
  );
}
