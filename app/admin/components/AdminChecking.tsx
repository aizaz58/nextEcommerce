"use client"

import { useAuth } from "@/contexts/AuthContext"
import { CircularProgress } from "@nextui-org/react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"
import {AdminLayout} from "./AdminLayout"

export  function AdminChecking({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!user && !isLoading) {
      const search = searchParams.toString()
      const currentPath = `${pathname}${search ? `?${search}` : ""}`
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
    }
  }, [user, isLoading, router, pathname, searchParams]);

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




