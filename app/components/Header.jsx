"üse client"
import { Heart, Search, ShoppingCart, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LogoutButton from "./LogoutButton";
import AuthContextProvider from "@/contexts/AuthContext";
import HeaderClientButtons from "./HeaderClientButtons";
import AdminButton from "./AdminButton";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const menuList = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "About",
      link: "/about-us",
    },
    {
      name: "Contact",
      link: "/contact-us",
    },
  ];

  const handleAccountClick = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white bg-opacity-65 backdrop-blur-2xl py-3 px-4 md:py-4 md:px-16 border-b flex items-center justify-between">
      <Link href={"/"}>
      logo
        {/* <img className="h-4 md:h-5" src="/logo.png" alt="Logo" /> */}
      </Link>
      <div className="hidden md:flex gap-2 items-center font-semibold">
        {menuList?.map((item, i) => (
          <Link key={i} href={item?.link}>
            <button className="text-sm px-4 py-2 rounded-lg hover:bg-gray-50">
              {item?.name}
            </button>
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-1 relative">
        <AuthContextProvider>
          <AdminButton />
        </AuthContextProvider>
        <Link href={`/search`}>
          <button
            title="Search Products"
            className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
          >
            <Search size={14} />
          </button>
        </Link>
        <AuthContextProvider>
          <HeaderClientButtons />
        </AuthContextProvider>
        <button
          title="My Account"
          onClick={handleAccountClick}
          className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
        >
          <UserCircle2 size={14} />
        </button>
        <AuthContextProvider>
          <LogoutButton />
        </AuthContextProvider>

        {/* Dropdown Menu for Mobile */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-4 z-50">
            {menuList.map((item, i) => (
              <Link key={i} href={item.link} onClick={() => setIsMenuOpen(false)}>
                <button className="block text-sm px-4 py-2 rounded-lg hover:bg-gray-50">
                  {item.name}
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
