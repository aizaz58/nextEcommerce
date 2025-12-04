"use client";

import AuthContextProvider from "@/contexts/AuthContext";
import { ReactNode } from "react";

export default function Layout({ children }:{children:ReactNode}) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
