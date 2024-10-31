import { useEffect } from "react";
import { MapRef } from "react-map-gl";

import useMapBasemapLayers from "@/hooks/use-map-basemap-layers";
import { toggleGroupLayers } from "@/utils/map";

import useMapBasemap from "./use-map-basemap";
import useMapLabels from "./use-map-labels";

export default function useApplyMapSettings(map: MapRef | null) {
  const [basemap] = useMapBasemap();
  const [labels] = useMapLabels();
  const [basemapLayers] = useMapBasemapLayers();

  useEffect(() => {
    if (map) {
      toggleGroupLayers(map, "basemap-", (group) => group === `basemap-${basemap}`);
      toggleGroupLayers(map, "labels-", (group) => group === `labels-${labels}`);
      toggleGroupLayers(
        map,
        "layer-",
        (group) => basemapLayers.findIndex((layer) => `layer-${layer}` === group) !== -1,
      );
    }
  }, [map, basemap, labels, basemapLayers]);
}
