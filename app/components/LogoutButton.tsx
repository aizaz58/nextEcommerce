"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { LogOut, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LogoutButton() {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user } = useAuth();
  if (!user) {
    return <></>;
  }
  const handleDelete=async()=>{
       try {
          await toast.promise(signOut(auth), {
            error: (e) => e?.message,
            loading: "Loading...",
            success: "Successfully Logged out",
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("An unexpected error occurred");
          }
        }
  }
  return (
<>
<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                      <AlertDialogTrigger asChild>
                        <Button
                        className="px-2"
                          variant="ghost" 
                          disabled={isDeleting}
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Logout review"
                        >
                          Log Out <LogOut size={14} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you  sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            You will be logged out from your account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete();
                            }}
                            disabled={isDeleting }
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                            {isDeleting ? "Logging Out..." : "Log Out"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>


    {/* <Button
      onClick={async () => {
        if (!confirm("Are you sure?")) return;
        try {
          await toast.promise(signOut(auth), {
            error: (e) => e?.message,
            loading: "Loading...",
            success: "Successfully Logged out",
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("An unexpected error occurred");
          }
        }
        
      }}
      className=" flex gap-2 px-2 "
      variant={"ghost"}
      >
      <LogOut size={14} />Log Out
    </Button> */}
      </>
  );
}
