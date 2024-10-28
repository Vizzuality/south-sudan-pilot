import { parseAsArrayOf, parseAsStringLiteral, useQueryState } from "nuqs";

import { BASEMAP_LAYERS, DEFAULT_MAP_SETTINGS } from "@/components/map/constants";

export default function useMapBasemapLayers() {
  return useQueryState(
    "basemap-layers",
    parseAsArrayOf(parseAsStringLiteral(DEFAULT_MAP_SETTINGS.basemapLayers)).withDefault(
      DEFAULT_MAP_SETTINGS.basemapLayers as (keyof typeof BASEMAP_LAYERS)[],
    ),
  );
}
