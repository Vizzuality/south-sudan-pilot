import { bbox } from "@turf/bbox";
import { useEffect, useMemo, useRef } from "react";
import { MapRef } from "react-map-gl";

import useLocation from "@/hooks/use-location";
import { useLocationGeometry } from "@/hooks/use-location-geometry";
import usePrevious from "@/hooks/use-previous";

export default function useApplyMapLocation(map: MapRef | null) {
  const [location] = useLocation();
  const previousLocation = usePrevious(location);

  // This flag indicates when to zoom the map on the location
  const triggerFitBoundsRef = useRef(false);

  const { data, isLoading } = useLocationGeometry(location.code.slice(-1)[0]);

  const bounds = useMemo(() => {
    if (isLoading || data === undefined || data === null) {
      return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return bbox(data) as [number, number, number, number];
  }, [data, isLoading]);

  useEffect(() => {
    const hasChangedLocation = location !== previousLocation;
    if (hasChangedLocation) {
      triggerFitBoundsRef.current = true;
    }

    if (map && !!bounds && triggerFitBoundsRef.current) {
      map.fitBounds(bounds);
      triggerFitBoundsRef.current = false;
    }
  }, [map, location, previousLocation, bounds]);
}
