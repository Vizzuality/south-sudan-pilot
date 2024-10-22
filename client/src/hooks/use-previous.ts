"use client";

import { useEffect, useRef } from "react";

export default function usePrevious<T>(value: T) {
  const ref = useRef(value);

  useEffect(() => {
    if (value !== ref.current) {
      ref.current = value;
    }
  }, [value]);

  return ref.current;
}
