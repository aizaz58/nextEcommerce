"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { Badge } from "@nextui-org/react";
import { Heart, ShoppingCart, UserCircle2 } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { useAdmin } from "@/lib/firestore/admins/read";

export default function HeaderClientButtons() {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const { data:isAdmin } = useAdmin({ email: user?.email });

  if(!user){
    <Button asChild>
    <Link href='/login'>
    <UserCircle2 size={14} />
    </Link>
  </Button>
  
  }
  const firstInitial = user?.displayName?.charAt(0).toUpperCase() ?? 'U';
  return (
    <div className="flex items-center gap-1">
       <Link href={`/favorites`}>
        {(data?.favorites?.length ?? 0) != 0 && (
          <Badge
            variant="solid"
            size="sm"
            className="text-primary-foreground bg-primary flex items-center font-semibold justify-center text-[10px]"
            content={data?.favorites?.length ?? 0}
          >
            <Button
              title="My Favorites"
              variant={"ghost"}
              size={"icon"}
              className="h-8 w-8 flex justify-center items-center rounded-full"
            >
              <Heart size={14} />
            </Button>
          </Badge>
        )}
        {(data?.favorites?.length ?? 0) === 0 && (
          <Button
            title="My Favorites"
            variant={"ghost"}
            size={"icon"}
            className="h-8 w-8 flex justify-center items-center rounded-full "
          >
            <Heart size={14} />
          </Button>
        )}
      </Link>
      <Link href={`/cart`}>
        {(data?.carts?.length ?? 0) != 0 && (
          <Badge
            variant="solid"
            size="sm"
            className="text-primary-foreground bg-primary flex items-center justify-center font-semibold text-[10px]"
            content={data?.carts?.length ?? 0}
          >
            <Button
              title="My Cart"
              size={"icon"}
              variant={"ghost"}
              className="h-8 w-8 flex justify-center items-center rounded-full "
            >
              <ShoppingCart size={14} />
            </Button>
          </Badge>
        )}
        {(data?.carts?.length ?? 0) === 0 && (
          <Button
            title="My Cart"
            size={"icon"}
            variant={"ghost"}
            className="h-8 w-8 flex justify-center items-center rounded-full "
          >
            <ShoppingCart size={14} />
          </Button>
        )}
      </Link>
     {user ?
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
    <div className='flex items-center'>
      <Button
        variant='ghost'
        className='relative w-8 h-8 rounded-full ml-2 flex items-center justify-center'
      >
        {firstInitial}
      </Button>
    </div>
  </DropdownMenuTrigger>
  <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <div className='text-sm font-medium leading-none'>
                {user?.displayName}
              </div>
              <div className='text-sm text-muted-foreground leading-none'>
                {user?.email}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
            <Link href='/user/profile' className='w-full'>
              User Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/account" className='w-full'>
              Order History
            </Link>
          </DropdownMenuItem>

          {isAdmin && (
            <DropdownMenuItem>
              <Link href={"/admin"} className='w-full'>
                Admin
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className='p-0 mb-1'>
          <LogoutButton /> 
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
:<Button asChild  variant='ghost'
className='focus-visible:ring-0 rounded-full focus-visible:ring-offset-0'
size={"icon"}
>
<Link href='/login'>
<UserCircle2 size={14} />
</Link>
</Button>

      }


     
    </div>
  );
}


