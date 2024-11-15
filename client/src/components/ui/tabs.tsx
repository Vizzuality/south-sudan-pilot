"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva("flex items-center", {
  variants: {
    variant: {
      default: "justify-start gap-4",
      yellow: "justify-between bg-rhino-blue-900 px-5 text-white lg:px-10",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>
>(({ variant, className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, className }))}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casper-blue-400 disabled:pointer-events-none disabled:opacity-20",
  {
    variants: {
      variant: {
        default:
          "border-b-4 border-b-rhino-blue-900 data-[state=active]:border-b-white transition-all data-[state=inactive]:opacity-30 text-sm leading-[26px] xl:text-base xl:leading-[26px]",
        yellow:
          "px-4 data-[state=active]:translate-y-3 data-[state=active]:bg-supernova-yellow-400 data-[state=active]:py-[18px] data-[state=inactive]:py-3 data-[state=active]:text-rhino-blue-950 data-[state=active]:transition-transform data-[state=inactive]:transition-colors data-[state=active]:duration-500 data-[state=inactive]:hover:text-supernova-yellow-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof tabsTriggerVariants>
>(({ variant, className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, className }))}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const tabsContentVariants = cva(
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casper-blue-400",
  {
    variants: {
      variant: {
        default: "pt-2",
        yellow: "text-rhino-blue-950 pt-3 bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> &
    VariantProps<typeof tabsContentVariants>
>(({ variant, className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(tabsContentVariants({ variant, className }))}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
