import { parseAsStringEnum, useQueryState } from "nuqs";

import { DEFAULT_MAP_SETTINGS } from "@/components/map/constants";
import { LabelsStyle } from "@/components/map/types";

export default function useMapLabels() {
  return useQueryState(
    "labels",
    parseAsStringEnum<LabelsStyle>(Object.values(LabelsStyle)).withDefault(
      DEFAULT_MAP_SETTINGS.labels,
    ),
  );
}
