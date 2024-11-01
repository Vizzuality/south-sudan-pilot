"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { showPercentage?: boolean }
>(({ className, min = 0, max = 1, step = 0.1, showPercentage = true, ...props }, ref) => {
  const value = props.value?.[0] ?? props.defaultValue?.[0] ?? 0;

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        {
          "relative flex w-full touch-none select-none items-center": true,
          "pt-4": showPercentage,
        },
        className,
      )}
      min={min}
      max={max}
      step={step}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-0.5 w-full grow rounded-full bg-casper-blue-500">
        <SliderPrimitive.Range className="absolute h-full bg-white" />
        <div className="absolute left-0 top-1/2 size-1 -translate-y-1/2 rounded-full bg-white" />
        <div className="absolute right-0 top-1/2 size-1 -translate-y-1/2 rounded-full bg-casper-blue-500" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="relative block h-2 w-2 rounded-full bg-white transition-colors hover:bg-casper-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casper-blue-500 disabled:pointer-events-none disabled:opacity-20">
        {showPercentage && (
          <div
            className={cn({
              "absolute bottom-1.5 text-xs text-white": true,
              "left-0": value === min,
              "left-1/2 -translate-x-1/2": value > min && value < max,
              "right-0": value === max,
            })}
            aria-hidden
          >
            {value * 100}%
          </div>
        )}
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
