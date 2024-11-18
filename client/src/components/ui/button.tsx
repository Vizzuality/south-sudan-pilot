import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "text-rhino-blue-900 bg-white border border-white hover:border-supernova-yellow-300 hover:bg-supernova-yellow-300 focus-visible:ring-casper-blue-400",
        "default-outline":
          "text-white bg-rhino-blue-900 border border-white hover:border-supernova-yellow-300 hover:text-supernova-yellow-300 focus-visible:ring-casper-blue-400",
        yellow:
          "bg-supernova-yellow-400 hover:bg-supernova-yellow-300 text-casper-blue-950 focus-visible:ring-casper-blue-400 data-[state=open]:bg-rhino-blue-900 data-[state=open]:hover:bg-rhino-blue-950 data-[state=open]:text-supernova-yellow-400",
        "yellow-alt":
          "bg-supernova-yellow-400 hover:bg-supernova-yellow-300 text-casper-blue-950 focus-visible:ring-casper-blue-400 data-[state=open]:bg-white data-[state=open]:hover:bg-casper-blue-200",
        ghost: "focus-visible:ring-casper-blue-400",
      },
      size: {
        default: "h-8 w-auto xl:h-10 px-4 xl:py-2",
        icon: "h-8 w-8 xl:h-10 xl:w-10",
        "icon-sm": "h-4 w-4",
        auto: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
