import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-3 w-full bg-secondary-foreground text-primary-foreground border-t p-5 md:p-10">
        
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

      <div className="border-b w-full flex flex-col md:flex-row md:justify-between gap-3">
        <div className="flex-1 flex flex-col md:flex-row justify-end gap-4">
          
          <div className="flex gap-2 items-center">
            <Phone size={16} />
            <a href="tel:+92910XXXXXXX" className="text-sm hover:text-primary-foreground/80">
              +92 910 XXXXXXX
            </a>
          </div>

          <div className="flex gap-2 items-center">
            <Mail size={16} />
            <a href="mailto:xyz@gmail.com" className="text-sm hover:text-primary-foreground/80">
              xyz@gmail.com
            </a>
          </div>

          <div className="flex gap-2 items-center">
            <MapPin size={16} />
            <h2 className="text-sm">Lahore</h2>
          </div>

        </div>
      </div>

      <div className="flex justify-center w-full">
        <h3 className="text-xs">
          © 2025 . All rights reserved by AheadMart
        </h3>
      </div>
      
    </footer>
  );
}
