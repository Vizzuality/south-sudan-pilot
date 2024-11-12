import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox";
import { useEffect, useMemo } from "react";
import { useMap } from "react-map-gl";

export default function useDeckGLMapboxOverlay(props: MapboxOverlayProps = { interleaved: true }) {
  const { current: map } = useMap();

  const mapboxOverlay = useMemo(
    () =>
      new MapboxOverlay({
        ...props,
        getCursor: () => map?.getCanvas().style.cursor || "",
      }),
    [props, map],
  );

  useEffect(() => {
    map?.addControl(mapboxOverlay);

    return () => {
      map?.removeControl(mapboxOverlay);
    };
  }, [map, mapboxOverlay]);

  return mapboxOverlay;
}
