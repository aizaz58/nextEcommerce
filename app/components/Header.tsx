
import { Heart, Search, ShoppingCart, UserCircle2 } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import AuthContextProvider from "@/contexts/AuthContext";
import HeaderClientButtons from "./HeaderClientButtons";
import AdminButton from "./AdminButton";
import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import Image from "next/image";

export default function Header() {
 
  
  return (
    <nav className="sticky top-0 z-50  backdrop-blur-2xl py-3 px-4 md:py-4 md:px-10 border-b flex items-center justify-between">
      <Link href={"/"} className='flex justify-center items-center flex-start md:ml-2 ml-4'>

 <Image
              src='/svgs/logo.svg'
              alt={`logo`}
              height={48}
              width={48}
              priority={true}
            />
             <span className='hidden lg:block font-bold text-2xl ml-3'>
              AHEADMART
            </span>
      </Link>
   
      <div className="flex items-center gap-1 relative">
       
        <Link href={`/search`}>
          <Button
      size={"icon"}
      variant={"ghost"}
            className="h-8 w-8 flex justify-center items-center rounded-full "
          >
            <Search size={14} />
          </Button>
        </Link>
      
      
      

      <ModeToggle/>
        <AuthContextProvider>
          <HeaderClientButtons />
        </AuthContextProvider>
      </div>
    </nav>
  );
}
