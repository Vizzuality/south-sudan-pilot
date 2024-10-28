"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as React from "react";

import { cn } from "@/lib/utils";
import CheckIcon from "@/svgs/check.svg";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-3 w-3 shrink-0 rounded-sm border border-rhino-blue-950 transition-colors hover:bg-rhino-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casper-blue-400 disabled:cursor-not-allowed disabled:opacity-20 data-[state=checked]:bg-rhino-blue-950 data-[state=checked]:text-white",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("text-current flex items-center justify-center")}>
      <CheckIcon className="h-full w-full" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
