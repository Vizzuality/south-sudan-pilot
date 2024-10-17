import dynamic from "next/dynamic";

// By forcing the map to load in the client, we can perform some media queries immediately. Without
// this, the map would still be loaded in the client only anyway.
const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function Home() {
  return (
    <main className="h-svh w-svw">
      <Map />
    </main>
  );
}
