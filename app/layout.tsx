export const dynamic = "force-dynamic";

import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { archivo, jetbrainsMono, staatliches } from "./fonts";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "AheadMart | The New place for everything",
  description: "You can buy everything on amazing discounts",
  metadataBase: new URL("https://aheadmart.com"),
  openGraph: {
    title: "AheadMart | The New place for everything",
    description: "You can buy everything on amazing discounts",
    url: "https://aheadmart.com",
    siteName: "AheadMart",
  },
  icons: {
    icon: "/favicon.ico", // Default favicon
    shortcut: "/favicon.ico",
    apple: "/favicon.png", // For Apple devices
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={cn(
        archivo.variable,
        staatliches.variable,
        jetbrainsMono.variable
      )}
      suppressHydrationWarning
      lang="en"
    >
      <body className="font-archivo">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <Toaster />
          <NextUIProvider>{children}</NextUIProvider>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
