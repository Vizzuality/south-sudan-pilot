"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import XMarkIcon from "@/svgs/xmark.svg";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-10 bg-white/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const dialogContentVariants = cva(
  "fixed left-[50%] top-[50%] z-10 flex max-h-[calc(100vh_-_2_*_68px-_theme(spacing.10))] w-full max-w-[calc(100vw_-_theme(spacing.10))] translate-x-[-50%] translate-y-[-50%] flex-col-reverse gap-4 bg-rhino-blue-900 text-white duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] xl:max-h-[calc(100vh_-_theme(spacing.10))] xl:flex-col",
  {
    variants: {
      variant: {
        default: "px-5 py-5 xl:px-10 xl:py-12 sm:max-w-lg",
        minimal: "px-5 py-5 xl:px-4 xl:py-4 sm:max-w-[400px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
    VariantProps<typeof dialogContentVariants>
>(({ className, variant, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(dialogContentVariants({ variant, className }))}
      {...props}
    >
      <div className="overflow-y-auto">{children}</div>
      <DialogPrimitive.Close
        className={cn({
          "ml-auto shrink-0 xl:absolute xl:right-0": true,
          "xl:top-0": variant === "minimal",
          "xl:top-5 xl:ml-0 xl:translate-x-1/2": variant !== "minimal",
        })}
        asChild
      >
        <Button type="button" variant={variant === "minimal" ? "ghost" : "yellow"} size="icon">
          <XMarkIcon
            aria-hidden
            className={cn({ "!size-5": true, "xl:!size-6": variant !== "minimal" })}
          />
          <span className="sr-only">Close</span>
        </Button>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />;
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex justify-end space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-base xl:text-[20px] xl:leading-[24px]", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
};
