import AuthContextProvider from "@/contexts/AuthContext"
import { AdminChecking } from "./components/AdminChecking";



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthContextProvider>
      
      <AdminChecking>{children}</AdminChecking>
    </AuthContextProvider>
  );
}
