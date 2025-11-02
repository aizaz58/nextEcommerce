"use client"

import AuthContextProvider, { useAuth } from "@/contexts/AuthContext"
import { CircularProgress } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { Suspense, useEffect } from "react"
import AdminLayout from "./components/AdminLayout"

export default function Layout({ children }) {
  return (
    <AuthContextProvider>
      <AdminChecking>{children}</AdminChecking>
    </AuthContextProvider>
  );
}

function AdminChecking({ children }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/login")
    }
  }, [user, isLoading]);

  if (!user && !isLoading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <h1>Please Login First!</h1>
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex justify-center items-center">
          <CircularProgress />
        </div>
      }
    >
      <AdminLayout>{children}</AdminLayout>
    </Suspense>
  )
}
