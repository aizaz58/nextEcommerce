

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva ,type VariantProps} from "class-variance-authority";

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
     
          default: "bg-primary text-primary-foreground hover:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-primary hover:border-primary/80  text-primary shadow-sm hover:bg-primary/10 hover:text-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
          ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean;  
  isDisabled?: boolean;
  isIconOnly?:boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false,isLoading,isDisabled,isIconOnly,children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), {
          "cursor-not-allowed opacity-50": isDisabled || isLoading, // Disable styles
          "p-2 aspect-square": isIconOnly, // Adjust padding for icon-only buttons
        },)}
        ref={ref}
        disabled={isDisabled || isLoading}
        {...props}
      >
         {isLoading ? (<div className="flex items-center justify-center gap-2">

{children} <Loader2 className="animate-spin size-5 text-white dark:text-black" /> 
</div>
) : (
 children
)}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
