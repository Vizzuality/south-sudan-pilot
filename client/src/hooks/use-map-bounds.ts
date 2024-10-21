import { parseAsJson, useQueryState } from "nuqs";
import { z } from "zod";

import { DEFAULT_BOUNDS } from "@/components/map/constants";

import type { LngLatLike } from "react-map-gl";

const createRefinedNumberSchema = (min: number, max: number, label: string) =>
  z
    .number()
    .min(min)
    .max(max)
    .refine(
      (n) => n >= min && n <= max,
      (n) => ({ message: `${label} must be between ${min} and ${max}, got ${n}` }),
    );

const LongitudeSchema = createRefinedNumberSchema(-180, 180, "Longitude");
const LatitudeSchema = createRefinedNumberSchema(-90, 90, "Latitude");
const CoordinatePairSchema = z.tuple([LongitudeSchema, LatitudeSchema]);

const boundsSchema = z
  .tuple([CoordinatePairSchema, CoordinatePairSchema])
  .refine(([[west, south], [east, north]]) => west < east && south < north, {
    message: "Southwest corner must be west and south of northeast corner",
    path: ["coordinates"],
  });

export default function useMapBounds() {
  return useQueryState(
    "bounds",
    parseAsJson<[LngLatLike, LngLatLike]>(boundsSchema.parse)
      .withDefault(DEFAULT_BOUNDS)
      .withOptions({
        throttleMs: 1000,
      }),
  );
}
