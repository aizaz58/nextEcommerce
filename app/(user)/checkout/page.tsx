import type { Metadata } from "next";
import CheckoutPageClient from "./components/CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout | AheadMart",
  description: "Review your cart, add your shipping address, and securely place your order on AheadMart.",
};

export default function Page() {
  return <CheckoutPageClient />;
}
