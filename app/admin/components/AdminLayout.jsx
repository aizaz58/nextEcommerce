"use client"

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/lib/firestore/admins/read";
import { Button, CircularProgress } from "@nextui-org/react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AppSidebar } from "@/components/app-sidebar";

export  function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef(null);
  const { user } = useAuth();
  const { data: admin, error, isLoading } = useAdmin({ email: user?.email });

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    toggleSidebar();
  }, [pathname]);

  useEffect(() => {
    // Only run in browser (not during SSR)
    if (typeof document === "undefined") {
      return;
    }

    function handleClickOutsideEvent(event) {
      if (sidebarRef.current && !sidebarRef?.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideEvent);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideEvent);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }
if (!user) {
    return null; // Don't render anything during SSR
  }
  if (error) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <h1 className="text-red-500">{error}</h1>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="h-screen w-screen flex flex-col gap-2 justify-center items-center">
        <h1 className="font-bold">You are not admin!</h1>
        <h1 className="text-gray-600 text-sm">{user?.email}</h1>
        <Button
          onClick={async () => {
            await signOut(auth);
          }}
        >
          Logout
        </Button>
      </div>
    )
  }

  return (
    <AppSidebar>
      {children}
    </AppSidebar>
  )
}
