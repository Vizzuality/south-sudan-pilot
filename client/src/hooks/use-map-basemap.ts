import { parseAsStringEnum, useQueryState } from "nuqs";

import { DEFAULT_MAP_SETTINGS } from "@/components/map/constants";
import { BasemapStyle } from "@/components/map/types";

export default function useMapBasemap() {
  return useQueryState(
    "basemap",
    parseAsStringEnum<BasemapStyle>(Object.values(BasemapStyle)).withDefault(
      DEFAULT_MAP_SETTINGS.basemap,
    ),
  );
}
