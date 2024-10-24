import { MapRef } from "react-map-gl";

/**
 * Toggle on/off the layers of the groups matching the prefix based on the return value of the
 * callback
 */
export const toggleGroupLayers = (
  map: MapRef,
  groupPrefix: string,
  callback: (groupName: string) => boolean,
) => {
  const mapboxMap = map?.getMap();
  const mapboxStyle = map?.getStyle();

  const { "mapbox:groups": mapboxGroups } =
    (mapboxStyle?.metadata as { "mapbox:groups": Record<string, { name: string }> }) ?? {};

  const mapboxLayers = mapboxStyle?.layers ?? [];

  const groupsIdsMatchingPrefix = Object.entries(mapboxGroups ?? {})
    .filter(([, { name }]) => name.startsWith(groupPrefix))
    .map(([key]) => key);

  mapboxLayers.forEach((layer) => {
    const { "mapbox:group": group } = (layer.metadata as { "mapbox:group": string }) ?? {};

    if (groupsIdsMatchingPrefix.includes(group)) {
      mapboxMap?.setLayoutProperty(
        layer.id,
        "visibility",
        callback(mapboxGroups[group].name) ? "visible" : "none",
      );
    }
  });
};
