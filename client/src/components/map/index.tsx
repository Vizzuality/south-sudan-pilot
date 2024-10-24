"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMapGL from "react-map-gl";

import { SIDEBAR_WIDTH } from "@/components/ui/sidebar";
import { env } from "@/env";
import useApplyMapSettings from "@/hooks/use-apply-map-settings";
import useBreakpoint from "@/hooks/use-breakpoint";
import useIsSidebarExpanded from "@/hooks/use-is-sidebar-expanded";
import useMapBounds from "@/hooks/use-map-bounds";
import usePrevious from "@/hooks/use-previous";

import { DESKTOP_MAX_BOUNDS, MOBILE_MAX_BOUNDS } from "./constants";
import Controls from "./controls";

import type { MapRef, LngLatLike } from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";

const Map = () => {
  const mapRef = useRef<MapRef>(null);
  const [map, setMap] = useState<MapRef | null>(null);

  const isDesktop = useBreakpoint("xl", false, true);

  const isSidebarExpanded = useIsSidebarExpanded();
  const previousIsSidebarExpanded = usePrevious(isSidebarExpanded);

  const [bounds, setBounds] = useMapBounds();

  const initialViewState = useMemo(() => {
    const padding = isDesktop ? 100 : 20;
    const sidebarPadding = isSidebarExpanded ? Number.parseInt(SIDEBAR_WIDTH.replace("px", "")) : 0;

    return {
      bounds: bounds,
      fitBoundsOptions: {
        padding: {
          top: padding,
          right: padding,
          bottom: padding,
          left: padding + sidebarPadding,
        },
      },
    };
  }, [bounds, isDesktop, isSidebarExpanded]);

  const onMove = useCallback(() => {
    setBounds(map?.getBounds()?.toArray() as [LngLatLike, LngLatLike]);
  }, [map, setBounds]);

  // Update the position of the map based on the sidebar's state
  useEffect(() => {
    if (isSidebarExpanded !== previousIsSidebarExpanded) {
      map?.fitBounds(bounds, initialViewState.fitBoundsOptions);
    }
  }, [map, isSidebarExpanded, previousIsSidebarExpanded, initialViewState, bounds]);

  // Apply the basemap and labels
  useApplyMapSettings(map);

  return (
    <ReactMapGL
      ref={mapRef}
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={initialViewState}
      maxBounds={isDesktop ? DESKTOP_MAX_BOUNDS : MOBILE_MAX_BOUNDS}
      style={{ width: "100%", height: "100%" }}
      mapStyle={env.NEXT_PUBLIC_MAPBOX_STYLE}
      onMove={onMove}
      logoPosition="bottom-right"
      onLoad={() => setMap(mapRef.current)}
    >
      <Controls />
    </ReactMapGL>
  );
};

export default Map;
