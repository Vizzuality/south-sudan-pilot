"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const popoverContentVariants = cva(
  "z-10 outline-none duration-500 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "bg-white",
        dark: "bg-rhino-blue-900 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
    VariantProps<typeof popoverContentVariants>
>(({ variant, className, align = "center", sideOffset = 16, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(popoverContentVariants({ variant, className }))}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const popoverArrowVariants = cva("", {
  variants: {
    variant: {
      default: "fill-white",
      dark: "fill-rhino-blue-900",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const PopoverArrow = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow> &
    VariantProps<typeof popoverArrowVariants>
>(({ variant, className, ...props }, ref) => (
  <PopoverPrimitive.Arrow
    ref={ref}
    className={cn(popoverArrowVariants({ variant, className }))}
    {...props}
  />
));
PopoverArrow.displayName = PopoverPrimitive.Arrow.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverArrow };
