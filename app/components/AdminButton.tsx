"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/lib/firestore/admins/read";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminButton() {
  const { user } = useAuth();
  const { data } = useAdmin({ email: user?.email });
  if (!data) {
    return <></>;
  }
  return (
    
     
      <Button asChild className="text-xs font-semibold">
<Link href={"/admin"}>Admin</Link>
      </Button>
   
  );
}
