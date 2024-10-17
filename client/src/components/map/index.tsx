"use client";

import ReactMapGL from "react-map-gl";

import { env } from "@/env";
import useBreakpoint from "@/hooks/use-breakpoint";

import { DEFAULT_BOUNDS } from "./constants";

import "mapbox-gl/dist/mapbox-gl.css";

const Map = () => {
  const isDesktop = useBreakpoint("xl", false, true);

  console.log(isDesktop);

  return (
    <ReactMapGL
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        bounds: DEFAULT_BOUNDS,
        fitBoundsOptions: {
          padding: isDesktop ? 100 : 20,
        },
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle={env.NEXT_PUBLIC_MAPBOX_STYLE}
    />
  );
};

export default Map;
