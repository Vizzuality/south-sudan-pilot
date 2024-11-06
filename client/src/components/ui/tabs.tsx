"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex items-center justify-between bg-rhino-blue-900 px-5 text-white lg:px-10",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casper-blue-400 disabled:pointer-events-none disabled:opacity-20 data-[state=active]:translate-y-3 data-[state=active]:bg-supernova-yellow-400 data-[state=active]:py-[18px] data-[state=inactive]:py-3 data-[state=active]:text-rhino-blue-950 data-[state=active]:transition-transform data-[state=inactive]:transition-colors data-[state=active]:duration-500 data-[state=inactive]:hover:text-supernova-yellow-400",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "bg-white pt-3 text-rhino-blue-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casper-blue-400",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
