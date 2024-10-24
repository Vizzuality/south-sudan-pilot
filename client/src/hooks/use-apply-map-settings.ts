import { useEffect } from "react";
import { MapRef } from "react-map-gl";

import { toggleGroupLayers } from "@/utils/map";

import useMapBasemap from "./use-map-basemap";
import useMapLabels from "./use-map-labels";

export default function useApplyMapSettings(map: MapRef | null) {
  const [basemap] = useMapBasemap();
  const [labels] = useMapLabels();

  useEffect(() => {
    if (map) {
      toggleGroupLayers(map, "basemap-", (group) => group === `basemap-${basemap}`);
      toggleGroupLayers(map, "labels-", (group) => group === `labels-${labels}`);
    }
  }, [map, basemap, labels]);
}
