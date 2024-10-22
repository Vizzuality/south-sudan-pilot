import { Metadata } from "next";
import dynamic from "next/dynamic";

import Navigation from "@/components/navigation";

// By forcing the map to load in the client, we can perform some media queries immediately. Without
// this, the map would still be loaded in the client only anyway.
const Map = dynamic(() => import("@/components/map"), { ssr: false });

export const metadata: Metadata = {
  alternates: {
    // Make sure that the query strings can be ignored by search engines
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main className="flex h-svh w-svw flex-col-reverse xl:block">
      <Navigation />
      <Map />
    </main>
  );
}
