"use client";

import { useSidebar } from "@/components/ui/sidebar";

import useBreakpoint from "./use-breakpoint";

export default function useIsSidebarExpanded() {
  const isDesktop = useBreakpoint("xl", false, true);
  const { state: sidebarState } = useSidebar();

  return isDesktop && sidebarState === "expanded";
}
