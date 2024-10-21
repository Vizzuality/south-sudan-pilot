import type { LngLatBoundsLike } from "react-map-gl";

export const DEFAULT_BOUNDS: LngLatBoundsLike = [
  [23.4392, 3.4882], // Southwest corner (west, south)
  [35.95, 12.2212], // Northeast corner (east, north)
];

export const DESKTOP_MAX_BOUNDS: LngLatBoundsLike = [
  [14, 1],
  [44, 15],
];

export const MOBILE_MAX_BOUNDS: LngLatBoundsLike = [
  [19, -8],
  [39, 23],
];
