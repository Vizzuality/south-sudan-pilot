"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import ReactMapGL from "react-map-gl";

import { SIDEBAR_WIDTH } from "@/components/ui/sidebar";
import { env } from "@/env";
import useBreakpoint from "@/hooks/use-breakpoint";
import useIsSidebarExpanded from "@/hooks/use-is-sidebar-expanded";
import useMapBounds from "@/hooks/use-map-bounds";
import usePrevious from "@/hooks/use-previous";

import { DESKTOP_MAX_BOUNDS, MOBILE_MAX_BOUNDS } from "./constants";
import Controls from "./controls";

import type { MapRef, LngLatLike } from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";

const Map = () => {
  const isDesktop = useBreakpoint("xl", false, true);
  const mapRef = useRef<MapRef>(null);

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
    if (mapRef.current) {
      setBounds(mapRef.current.getBounds()?.toArray() as [LngLatLike, LngLatLike]);
    }
  }, [mapRef, setBounds]);

  // Update the position of the map based on the sidebar's state
  useEffect(() => {
    if (isSidebarExpanded !== previousIsSidebarExpanded) {
      mapRef.current?.fitBounds(bounds, initialViewState.fitBoundsOptions);
    }
  }, [isSidebarExpanded, previousIsSidebarExpanded, initialViewState, bounds]);

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
    >
      <Controls />
    </ReactMapGL>
  );
};

export default Map;
