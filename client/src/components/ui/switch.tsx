"use client";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-[3px] border-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casper-blue-400 disabled:cursor-not-allowed disabled:opacity-20 data-[state=checked]:bg-supernova-yellow-400 data-[state=unchecked]:bg-casper-blue-400 data-[state=checked]:hover:bg-supernova-yellow-300 data-[state=unchecked]:hover:bg-casper-blue-300",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full border-[3px] border-white bg-rhino-blue-950 ring-0 transition-transform data-[state=checked]:translate-x-[16px] data-[state=unchecked]:-translate-x-[3px]",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
