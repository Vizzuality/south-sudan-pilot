"use client";

import { useCallback, useRef } from "react";
import ReactMapGL from "react-map-gl";

import { env } from "@/env";
import useBreakpoint from "@/hooks/use-breakpoint";
import useMapBounds from "@/hooks/use-map-bounds";

import { DESKTOP_MAX_BOUNDS, MOBILE_MAX_BOUNDS } from "./constants";

import type { MapRef, LngLatLike } from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";

const Map = () => {
  const isDesktop = useBreakpoint("xl", false, true);
  const mapRef = useRef<MapRef>(null);

  const [bounds, setBounds] = useMapBounds();

  const onMove = useCallback(() => {
    if (mapRef.current) {
      setBounds(mapRef.current.getBounds()?.toArray() as [LngLatLike, LngLatLike]);
    }
  }, [mapRef, setBounds]);

  return (
    <ReactMapGL
      ref={mapRef}
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        bounds: bounds,
        fitBoundsOptions: {
          padding: isDesktop ? 100 : 20,
        },
      }}
      maxBounds={isDesktop ? DESKTOP_MAX_BOUNDS : MOBILE_MAX_BOUNDS}
      style={{ width: "100%", height: "100%" }}
      mapStyle={env.NEXT_PUBLIC_MAPBOX_STYLE}
      onMove={onMove}
    />
  );
};

export default Map;
