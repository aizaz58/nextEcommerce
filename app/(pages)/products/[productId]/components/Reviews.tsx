"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useAuth } from "@/contexts/AuthContext";
import { useReviews } from "@/lib/firestore/reviews/read";
import { deleteReview } from "@/lib/firestore/reviews/write";
import { Rating } from "@mui/material";
import { ArrowUpRightIcon, NotebookPenIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type Review = {
  id?: string;
  displayName?: string;
  message?: string;
  photoURL?: string;
  rating?: number;
  uid?: string;
};

export default function Reviews({ productId }: { productId: string }) {
  const { data } = useReviews({ productId: productId });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("Please Logged In First");
      }
      await deleteReview({
        uid: user?.uid,
        productId: productId,
      });
      toast.success("Successfully Deleted");
      setIsOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete review");
      }
    }
    setIsLoading(false);
    setIsDeleting(false);
  };

  return (
    <div className="flex flex-col gap-3 p-3 rounded-xl border w-full">
      <h1 className="text-lg font-semibold">Reviews</h1>
      <div className="flex flex-col gap-4">
        {(data?.length === 0 || data === undefined || data === null) && (
          <div className="text-muted-foreground text-center">
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <NotebookPenIcon/>
        </EmptyMedia>
        <EmptyTitle>No Reviews Yet</EmptyTitle>
        <EmptyDescription>
          No review posted  on that product.
          
        </EmptyDescription>
      </EmptyHeader>
      
     
    </Empty></div>
        )}
        {data?.map((item: Review, index: number) => {
          const nameLetters=item.displayName?.split(" ").map(word=>word[0]).join("").toUpperCase()
          return (
            <div className="flex gap-3" key={item.id ?? item.uid ?? index}>
              <div className="">
                <Avatar>
                  <AvatarImage src={item.photoURL}/>
                  <AvatarFallback>{nameLetters}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between">
                  <div>
                    <h1 className="font-semibold">{item?.displayName}</h1>
                    <Rating value={item?.rating ?? 0} readOnly size="small" />
                  </div>
                  {user?.uid === item?.uid && (
                    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          disabled={isDeleting}
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Delete review"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you  sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the review{" "}.

                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete();
                            }}
                            disabled={isDeleting || isLoading}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  )}
                </div>
                <p className="text-sm  pt-1">{item?.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
