"use client";

import {
  ComponentPropsWithoutRef,
  createContext,
  ElementRef,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import CheckIcon from "@/svgs/check.svg";
import ChevronDownIcon from "@/svgs/chevron-down.svg";
import MagnifyingGlassIcon from "@/svgs/magnifying-glass.svg";

interface IComboboxContent {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
}

const ComboboxContext = createContext<IComboboxContent>({
  // Internal open state of the combobox
  open: false,
  // Toggle the internal open state of the combobox
  setOpen: () => {
    throw new Error("ComboboxContext must be used within <ComboboxContext.Provider />.");
  },
  // Internal value of the combobox
  value: "",
  // Modify the internal value of the combobox
  setValue: () => {
    throw new Error("ComboboxContext must be used within <ComboboxContext.Provider />.");
  },
});

const Combobox = ({
  children,
  open: openProps,
  onOpenChange: onOpenChangeProps,
  value: valueProps,
  onValueChange: onValueChangeProps,
  ...props
}: ComponentPropsWithoutRef<typeof Popover> & {
  value?: string;
  onValueChange?: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const onOpen = useCallback(
    (open: boolean) => {
      setOpen(open);
      if (onOpenChangeProps !== undefined) {
        onOpenChangeProps(open);
      }
    },
    [onOpenChangeProps, setOpen],
  );

  const onChangeValue = useCallback(
    (value: string) => {
      setValue(value);
      if (onValueChangeProps !== undefined) {
        onValueChangeProps(value);
      }
    },
    [onValueChangeProps, setValue],
  );

  const contextValue = useMemo(() => {
    return {
      open,
      setOpen: onOpen,
      value,
      setValue: onChangeValue,
    };
  }, [open, onOpen, value, onChangeValue]);

  // When the `open` prop of the component changes, we update the internal state
  useEffect(() => {
    if (openProps !== undefined) {
      setOpen(openProps);
    }
  }, [openProps, setOpen]);

  // When the `value` prop of the component changes, we update the internal state
  useEffect(() => {
    if (valueProps !== undefined) {
      setValue(valueProps);
    }
  }, [valueProps, setValue]);

  return (
    <Popover open={open} onOpenChange={onOpen} modal {...props}>
      <ComboboxContext.Provider value={contextValue}>{children}</ComboboxContext.Provider>
    </Popover>
  );
};
Combobox.displayName = "Combobox";

const ComboboxTrigger = forwardRef<
  ElementRef<typeof Button>,
  ComponentPropsWithoutRef<typeof Button>
>(({ className, children, ...props }, ref) => {
  const { open } = useContext(ComboboxContext);

  return (
    <PopoverTrigger ref={ref} asChild>
      <Button
        type="button"
        variant="ghost"
        size="auto"
        role="combobox"
        aria-expanded={open}
        className={cn(
          "group/combobox flex w-full items-center justify-between border border-casper-blue-400 bg-white px-3 py-1.5 text-sm text-rhino-blue-950 transition-colors placeholder:text-rhino-blue-950 hover:bg-casper-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casper-blue-400 disabled:cursor-not-allowed disabled:opacity-20 data-[state=open]:bg-casper-blue-200 [&>span]:line-clamp-1",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          className="h-5 w-5 group-data-[state=open]/combobox:rotate-180"
          aria-hidden
        />
      </Button>
    </PopoverTrigger>
  );
});
ComboboxTrigger.displayName = "ComboboxTrigger";

const ComboboxContent = forwardRef<
  ElementRef<typeof PopoverContent>,
  ComponentPropsWithoutRef<typeof PopoverContent>
>(({ className, children, ...props }, ref) => (
  <PopoverContent
    ref={ref}
    sideOffset={2}
    className={cn(
      "z-20 w-[var(--radix-popover-trigger-width)] border border-casper-blue-400 bg-casper-blue-200 p-1 text-rhino-blue-950",
      className,
    )}
    {...props}
  >
    <Command>{children}</Command>
  </PopoverContent>
));
ComboboxContent.displayName = "ComboboxContent";

const ComboboxInput = forwardRef<
  ElementRef<typeof CommandInput>,
  ComponentPropsWithoutRef<typeof CommandInput>
>(({ className, ...props }, ref) => (
  <div
    className="-mx-1 -mt-1 flex items-center gap-2 border-b border-casper-blue-400 bg-rhino-blue-50 px-2 py-1 text-rhino-blue-950"
    cmdk-input-wrapper=""
  >
    <MagnifyingGlassIcon className="size-5 shrink-0" aria-hidden />
    <CommandInput ref={ref} className={cn("", className)} {...props} />
  </div>
));
ComboboxInput.displayName = "ComboboxInput";

const ComboboxList = forwardRef<
  ElementRef<typeof CommandList>,
  ComponentPropsWithoutRef<typeof CommandList>
>(({ className, children, ...props }, ref) => (
  <CommandList ref={ref} className={cn("mt-1", className)} {...props}>
    {children}
  </CommandList>
));
ComboboxList.displayName = "ComboboxList";

const ComboboxEmpty = forwardRef<
  ElementRef<typeof CommandEmpty>,
  ComponentPropsWithoutRef<typeof CommandEmpty>
>(({ className, children, ...props }, ref) => (
  <CommandEmpty ref={ref} className={className} {...props}>
    {children}
  </CommandEmpty>
));
ComboboxEmpty.displayName = "ComboboxEmpty";

const ComboboxLoading = forwardRef<
  ElementRef<typeof CommandLoading>,
  ComponentPropsWithoutRef<typeof CommandLoading>
>(({ className, children, ...props }, ref) => (
  <CommandLoading ref={ref} className={className} {...props}>
    {children}
  </CommandLoading>
));
ComboboxLoading.displayName = "ComboboxLoading";

const ComboboxItem = forwardRef<
  ElementRef<typeof CommandItem>,
  ComponentPropsWithoutRef<typeof CommandItem> & { value: string }
>(({ className, children, value: valueProps, onSelect: onSelectProps, ...props }, ref) => {
  const { value, setValue, setOpen } = useContext(ComboboxContext);

  const onSelect = useCallback(
    (selectedValue: string) => {
      setValue(selectedValue);

      if (onSelectProps) {
        onSelectProps(selectedValue);
      }

      setOpen(false);
    },
    [onSelectProps, setValue, setOpen],
  );

  return (
    <CommandItem
      ref={ref}
      className={cn({ "font-semibold": valueProps === value }, className)}
      value={valueProps}
      onSelect={onSelect}
      {...props}
    >
      {valueProps === value && <CheckIcon className="mr-2 h-4 w-4" aria-hidden />}
      {children}
    </CommandItem>
  );
});
ComboboxItem.displayName = "ComboboxItem";

export {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxEmpty,
  ComboboxLoading,
  ComboboxItem,
};
