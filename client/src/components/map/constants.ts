import { BasemapStyle, LabelsStyle } from "./types";

import type { LngLatLike } from "react-map-gl";

export const DEFAULT_BOUNDS: [LngLatLike, LngLatLike] = [
  [23.4392, 3.4882], // Southwest corner (west, south)
  [35.95, 12.2212], // Northeast corner (east, north)
];

export const DESKTOP_MAX_BOUNDS: [LngLatLike, LngLatLike] = [
  [14, 1],
  [44, 15],
];

export const MOBILE_MAX_BOUNDS: [LngLatLike, LngLatLike] = [
  [19, -8],
  [39, 23],
];

export const BASEMAPS: Record<BasemapStyle, { name: string; image: string }> = {
  light: {
    name: "Light",
    image: "/assets/images/basemap-light.png",
  },
  dark: {
    name: "Dark",
    image: "/assets/images/basemap-dark.png",
  },
  satellite: {
    name: "Satellite",
    image: "/assets/images/basemap-satellite.png",
  },
};

export const LABELS: Record<LabelsStyle, { name: string }> = {
  dark: {
    name: "Dark",
  },
  light: {
    name: "Light",
  },
  "": {
    name: "No labels",
  },
};

export const DEFAULT_MAP_SETTINGS = {
  basemap: BasemapStyle.Light,
  labels: LabelsStyle.Dark,
};
