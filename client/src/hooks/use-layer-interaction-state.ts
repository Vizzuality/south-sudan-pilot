"use client";

import { atom, useAtom } from "jotai";
import { useCallback, useMemo } from "react";

import { LayerInteractionState } from "@/types/layer";

// NOTE: prefer using the hook below instead of the atom directly, unless you need to access all the
// hovered features at once
export const hoveredFeatureByLayerAtom = atom<
  Record<number, LayerInteractionState["hoveredFeature"]>
>({});

// NOTE: prefer using the hook below instead of the atom directly, unless you need to access all the
// selected features at once
export const selectedFeatureByLayerAtom = atom<
  Record<number, LayerInteractionState["selectedFeature"]>
>({});

export default function useLayerInteractionState(layerId: number | undefined) {
  const [hoveredFeatureByLayer, setHoveredFeatureByLayer] = useAtom(hoveredFeatureByLayerAtom);
  const [selectedFeatureByLayer, setSelectedFeatureByLayer] = useAtom(selectedFeatureByLayerAtom);

  const hoveredFeature = useMemo<LayerInteractionState["hoveredFeature"]>(
    () => (layerId === undefined ? null : (hoveredFeatureByLayer[layerId] ?? null)),
    [layerId, hoveredFeatureByLayer],
  );

  const selectedFeature = useMemo<LayerInteractionState["selectedFeature"]>(
    () => (layerId === undefined ? null : (selectedFeatureByLayer[layerId] ?? null)),
    [layerId, selectedFeatureByLayer],
  );

  const setHoveredFeature = useCallback(
    (value: LayerInteractionState["hoveredFeature"]) => {
      if (layerId !== undefined) {
        setHoveredFeatureByLayer((prev) => ({ ...prev, [layerId]: value }));
      }
    },
    [layerId, setHoveredFeatureByLayer],
  );

  const setSelectedFeature = useCallback(
    (value: LayerInteractionState["selectedFeature"]) => {
      if (layerId !== undefined) {
        setSelectedFeatureByLayer((prev) => ({ ...prev, [layerId]: value }));
      }
    },
    [layerId, setSelectedFeatureByLayer],
  );

  return [
    { hoveredFeature, selectedFeature } as LayerInteractionState,
    { setHoveredFeature, setSelectedFeature },
  ] as const;
}
