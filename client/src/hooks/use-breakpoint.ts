"use client";

import { useEffect, useMemo, useState } from "react";

import useIsClient from "@/hooks/use-is-client";
import tailwindConfig from "@/lib/tailwind-config";

const doesQueryMatch = (breakpointValue: string) => {
  const query = window.matchMedia(`(min-width: ${breakpointValue})`);
  return query.matches;
};

/**
 *
 * @param breakpoint Breakpoint's Tailwind CSS name
 * @param defaultValue Default return value when running on the server
 * @param isClientOnly Indicate that this hook is only run on the client (no ssr) and provide an
 * immediate and unique return value
 * @returns
 */
export default function useBreakpoint(
  breakpoint: keyof typeof tailwindConfig.theme.screens,
  defaultValue: boolean,
  isClientOnly: boolean = false,
) {
  const breakpointValue = useMemo(() => tailwindConfig.theme.screens[breakpoint], [breakpoint]);

  const isClient = useIsClient();
  const [isMatch, setIsMatch] = useState(
    isClientOnly ? doesQueryMatch(breakpointValue) : defaultValue,
  );

  useEffect(() => {
    if (isClient && !isClientOnly) {
      setIsMatch(doesQueryMatch(breakpointValue));
    }
  }, [isClient, isClientOnly, breakpointValue]);

  return isMatch;
}
