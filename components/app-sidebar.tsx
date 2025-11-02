"use client"

import React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Cat,
  Layers2,
  LayoutDashboard,
  LibraryBig,
  PackageOpen,
  ShieldCheck,
  ShoppingCart,
  Star,
  User,
  Menu,
} from "lucide-react";
import Link from "next/link"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Hook to detect tablet mode (typically 768px - 1024px)
function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    // Only run in browser (not during SSR)
    if (typeof window === "undefined") {
      return
    }

    const checkTablet = () => {
      const width = window.innerWidth
      // Tablet: 768px to 1024px
      setIsTablet(width >= 768 && width < 1024)
    }

    checkTablet()
    window.addEventListener("resize", checkTablet)
    return () => window.removeEventListener("resize", checkTablet)
  }, [])

  return isTablet
}

export function AppSidebar({children}: {children: React.ReactNode}) {
  const [open, setOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isTablet = useIsTablet()
  
  const menuList = [
    {
      name: "Dashboard",
      link: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Products",
      link: "/admin/products",
      icon: <PackageOpen className="h-5 w-5" />,
    },
    {
      name: "Categories",
      link: "/admin/categories",
      icon: <Layers2 className="h-5 w-5" />,
    },
    {
      name: "Brands",
      link: "/admin/brands",
      icon: <Cat className="h-5 w-5" />,
    },
    {
      name: "Orders",
      link: "/admin/orders",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: "Customers",
      link: "/admin/customers",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "Reviews",
      link: "/admin/reviews",
      icon: <Star className="h-5 w-5" />,
    },
    {
      name: "Collections",
      link: "/admin/collections",
      icon: <LibraryBig className="h-5 w-5" />,
    },
    {
      name: "Admins",
      link: "/admin/admins",
      icon: <ShieldCheck className="h-5 w-5" />,
    },
  ];
  
  // Force collapsed state on tablet mode - always keep sidebar collapsed on tablets
  useEffect(() => {
    if (isTablet) {
      setSidebarOpen(false)
    }
  }, [isTablet])

  // Handle sidebar toggle - prevent expansion on tablets
  const handleSidebarToggle = (newState: boolean) => {
    if (!isTablet) {
      setSidebarOpen(newState)
    }
    // On tablet, always keep it collapsed
  }

  return (
    <SidebarProvider 
      open={isTablet ? false : sidebarOpen}
      onOpenChange={handleSidebarToggle}
    >
      {/* Desktop Sidebar */}
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {menuList.map((item, index) => (
                <SidebarItem
                  key={index}
                  icon={item.icon}
                  label={item.name}
                  href={item.link}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Mobile Sidebar (drawer) */}
      <div className="md:hidden fixed top-3 left-2 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-1 bg-background rounded-md shadow-md border">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 pt-6 p-0">
            <nav className="flex flex-col pt-9 p-4 gap-2">
              {menuList.map((item, index) => (
                <MobileMenuItem
                  key={index}
                  icon={item.icon}
                  label={item.name}
                  href={item.link}
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <SidebarInset className="md:p-6 min-w-0">
        {/* Hide trigger on tablet (md to lg-1), show on desktop (lg+) */}
        <div className="hidden md:block mb-4">
          <div className="hidden lg:block">
            <SidebarTrigger />
          </div>
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

// Reusable item component for desktop sidebar
function SidebarItem({
  icon,
  label,
  href,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  href: string
  onClick?: () => void
}) {
  const { state } = useSidebar() // "expanded" | "collapsed"

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={label}>
        <Link
          href={href}
          className="flex items-center gap-2"
          onClick={onClick}
        >
          {icon}
          {state === "expanded" && <span>{label}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

// Mobile menu item component
function MobileMenuItem({
  icon,
  label,
  href,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  href: string
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  )
}
