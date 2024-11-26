import { PickingInfo } from "@deck.gl/core";
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox";
import { useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useMap } from "react-map-gl";

import { selectedFeatureByLayerAtom } from "@/hooks/use-layer-interaction-state";

export default function useDeckGLMapboxOverlay(props: MapboxOverlayProps = { interleaved: true }) {
  const { current: map } = useMap();
  const cursorRef = useRef("grab");
  const setSelectedFeatureByLayer = useSetAtom(selectedFeatureByLayerAtom);

  const onClick = useCallback(
    ({ picked }: PickingInfo) => {
      if (!picked) {
        // If the user clicks on the map and no geometry was below the cursor, then we make sure to
        // reset all the layers' selected features
        setSelectedFeatureByLayer({});
      }
    },
    [setSelectedFeatureByLayer],
  );

  const onHover = useCallback(
    ({ picked }: PickingInfo) => {
      cursorRef.current = picked ? "pointer" : "grab";
      if (map) {
        map.getCanvas().style.cursor = cursorRef.current;
      }
    },
    [map],
  );

  const mapboxOverlay = useMemo(
    () =>
      new MapboxOverlay({
        ...props,
        getCursor: () => cursorRef.current,
        onClick,
        onHover,
      }),
    [props, onClick, onHover],
  );

  useEffect(() => {
    map?.addControl(mapboxOverlay);

    return () => {
      map?.removeControl(mapboxOverlay);
    };
  }, [map, mapboxOverlay]);

  return mapboxOverlay;
}
