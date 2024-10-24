"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const radioGroupItemVariants = cva(
  "peer aspect-square rounded-full border ring-offset-white transition-colors focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casper-blue-400 disabled:cursor-not-allowed disabled:opacity-20",
  {
    variants: {
      variant: {
        default:
          "border-rhino-blue-950 hover:bg-rhino-blue-50 data-[state=checked]:border-4 data-[state=checked]:hover:border-rhino-blue-900",
        icon: "border-white flex items-center justify-center data-[state=checked]:border-rhino-blue-950",
      },
      size: {
        default: "h-3 w-3",
        icon: "h-[26px] w-[26px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.PropsWithChildren<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>> &
    VariantProps<typeof radioGroupItemVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioGroupItemVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

const RadioGroupIndicator = RadioGroupPrimitive.Indicator;

export { RadioGroup, RadioGroupItem, RadioGroupIndicator };
