"use client";

import AuthContextProvider, { useAuth } from "@/contexts/AuthContext";
import { CircularProgress } from "@nextui-org/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useSearchParams } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
    
      <AuthContextProvider>
        <UserChecking>
          <section className="min-h-screen">{children}</section>
        </UserChecking>
      </AuthContextProvider>
      
    </main>
  );
}

function UserChecking({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const currentPath = `${pathname}${search ? `?${search}` : ""}`;
  const loginHref = `/login?redirect=${encodeURIComponent(currentPath)}`;
  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <CircularProgress  className="text-primary-foreground"/>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col gap-3 justify-center items-center">
        <h1 className="text-sm text-muted-foreground">You are not logged in!</h1>
        <Link href={loginHref}>
          <Button className=" text-sm px-6 rounded-xl">
            Login
          </Button>
        </Link>
      </div>
    );
  }
  return <>{children}</>;
}
