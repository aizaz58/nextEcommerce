"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

export default function LogoutButton() {
  const { user } = useAuth();
  if (!user) {
    return <></>;
  }
  return (
    <Button
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
    </Button>
  );
}
