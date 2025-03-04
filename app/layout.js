import localFont from "next/font/local";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ThemeProvider } from "next-themes";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >

        <Toaster />
        <NextUIProvider>{children}</NextUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
