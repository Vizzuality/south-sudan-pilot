import { parseAsArrayOf, parseAsJson, useQueryState } from "nuqs";
import { useCallback } from "react";
import { z } from "zod";

import { LayerSettings } from "@/types/layer";

const schema = z.object({
  id: z.number(),
  visibility: z.boolean(),
  opacity: z.number().min(0).max(1),
  "return-period": z.number().int().optional(),
  date: z.string().date().optional(),
});

export default function useMapLayers() {
  const [layers, setLayers] = useQueryState(
    "layers",
    parseAsArrayOf(parseAsJson(schema.parse)).withDefault([]),
  );

  const addLayer = useCallback(
    (id: number, attributes?: Partial<z.infer<typeof schema>>) => {
      setLayers((layers) => [
        {
          id,
          visibility: true,
          opacity: 1,
          ...attributes,
        },
        ...layers,
      ]);
    },
    [setLayers],
  );

  const removeLayer = useCallback(
    (id: number) => {
      setLayers((layers) => layers.filter((layer) => layer.id !== id));
    },
    [setLayers],
  );

  const updateLayer = useCallback(
    (id: number, attributes: Partial<z.infer<typeof schema>>) => {
      setLayers((layers) =>
        layers.map((layer) => (layer.id === id ? { ...layer, ...attributes } : layer)),
      );
    },
    [setLayers],
  );

  const updateLayerOrder = useCallback(
    (id: number, position: number) => {
      setLayers((layers) => {
        const newLayers = [...layers];
        const previousLayerPosition = layers.findIndex((layer) => layer.id === id);

        if (previousLayerPosition !== -1) {
          const [layer] = newLayers.splice(previousLayerPosition, 1);
          newLayers.splice(position, 0, layer);
        }

        return newLayers;
      });
    },
    [setLayers],
  );

  return [
    layers as (LayerSettings & { id: number })[],
    { addLayer, removeLayer, updateLayer, updateLayerOrder },
  ] as const;
}
