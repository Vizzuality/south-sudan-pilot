"use client";

import { Provider as JotaiProvider } from "jotai";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { PropsWithChildren } from "react";

import ReactQueryProvider from "@/app/react-query-provider";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ReactQueryProvider>
      <NuqsAdapter>
        <JotaiProvider>{children}</JotaiProvider>
      </NuqsAdapter>
    </ReactQueryProvider>
  );
};

export default Providers;
