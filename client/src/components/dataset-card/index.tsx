"use client";

import { useCallback, useMemo, useState } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useMapLayers from "@/hooks/use-map-layers";
import { DatasetLayersDataItem } from "@/types/generated/strapi.schemas";

interface DatasetCardProps {
  id: number;
  name: string;
  defaultLayerId: number | undefined;
  layers: DatasetLayersDataItem[];
}

const DatasetCard = ({ id, name, defaultLayerId, layers }: DatasetCardProps) => {
  const [layersConfiguration, { addLayer, updateLayer, removeLayer }] = useMapLayers();

  const defaultSelectedLayerId = useMemo(() => {
    // The ids of the layers that belong to the dataset
    const datasetLayerIds = layers.map(({ id }) => id!);
    // The ids of the layers active on the map, probably not from this dataset
    const activeLayerIds = layersConfiguration.map(({ id }) => id!);
    // The id of the layer that belongs to the dataset and is active, if any
    const activeDatasetLayerId = datasetLayerIds.find((id) => activeLayerIds.includes(id));

    if (activeDatasetLayerId) {
      return activeDatasetLayerId;
    }

    return defaultLayerId;
  }, [layers, defaultLayerId, layersConfiguration]);

  const [selectedLayerId, setSelectedLayerId] = useState(defaultSelectedLayerId);

  const isDatasetActive = useMemo(() => {
    if (selectedLayerId === undefined) {
      return false;
    }

    return layersConfiguration.findIndex(({ id }) => id === selectedLayerId) !== -1;
  }, [selectedLayerId, layersConfiguration]);

  const onToggleDataset = useCallback(
    (active: boolean) => {
      if (selectedLayerId === undefined) {
        return;
      }

      if (!active) {
        removeLayer(selectedLayerId);
      } else {
        addLayer(selectedLayerId);
      }
    },
    [selectedLayerId, addLayer, removeLayer],
  );

  const onChangeSelectedLayer = useCallback(
    (stringId: string) => {
      const id = Number.parseInt(stringId);
      const previousId = selectedLayerId;

      setSelectedLayerId(id);
      // If the dataset was active and the layer is changed, we replace the current layer by the new
      // one keeping all the same settings (visibility, opacity, etc.)
      if (isDatasetActive && previousId !== undefined) {
        updateLayer(previousId, { id });
      }
    },
    [selectedLayerId, setSelectedLayerId, isDatasetActive, updateLayer],
  );

  return (
    <div className="p-4 border-image-[url(/assets/images/border-image.svg)] border-slice-10 border-image-width-2.5 border-outset-[5px] border-repeat-round">
      <div className="flex items-start justify-between gap-4">
        <Label htmlFor={`${id}-toggle`} className="text-[20px]">
          {name}
        </Label>
        <div className="pt-1">
          <Switch id={`${id}-toggle`} checked={isDatasetActive} onCheckedChange={onToggleDataset} />
        </div>
      </div>
      <div className="mt-1">
        <Select
          value={selectedLayerId !== undefined ? `${selectedLayerId}` : ""}
          onValueChange={onChangeSelectedLayer}
        >
          <SelectTrigger aria-label="Layer">
            <SelectValue placeholder="Select a layer" />
          </SelectTrigger>
          <SelectContent>
            {layers.map((layer) => (
              <SelectItem key={layer.id} value={`${layer.id}`}>
                {layer.attributes?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DatasetCard;
