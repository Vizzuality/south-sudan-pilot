import { useEffect, useState } from "react";
import { useMap } from "react-map-gl";

export default function useMapZoom() {
  const { current: map } = useMap();
  const [zoom, setZoom] = useState(map?.getZoom() ?? 0);

  useEffect(() => {
    const onZoom = () => {
      setZoom(map!.getZoom());
    };

    if (!map) {
      return;
    }

    onZoom();
    map.on("zoom", onZoom);

    return () => {
      map.off("zoom", onZoom);
    };
  }, [map]);

  return zoom;
}
