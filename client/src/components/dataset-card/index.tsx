"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import DownloadIcon from "@/svgs/download.svg";
import { DatasetLayersDataItem } from "@/types/generated/strapi.schemas";

import { getDefaultReturnPeriod, getDefaultSelectedLayerId, getReturnPeriods } from "./utils";

interface DatasetCardProps {
  id: number;
  name: string;
  defaultLayerId: number | undefined;
  layers: DatasetLayersDataItem[];
}

const DatasetCard = ({ id, name, defaultLayerId, layers }: DatasetCardProps) => {
  const [layersConfiguration, { addLayer, updateLayer, removeLayer }] = useMapLayers();

  const defaultSelectedLayerId = useMemo(
    () => getDefaultSelectedLayerId(defaultLayerId, layers, layersConfiguration),
    [layers, defaultLayerId, layersConfiguration],
  );

  const defaultSelectedReturnPeriod = useMemo(
    () => getDefaultReturnPeriod(defaultSelectedLayerId, layers, layersConfiguration),
    [layers, layersConfiguration, defaultSelectedLayerId],
  );

  const [selectedLayerId, setSelectedLayerId] = useState(defaultSelectedLayerId);
  const [selectedReturnPeriod, setSelectedReturnPeriod] = useState(defaultSelectedReturnPeriod);

  const selectedLayer = useMemo(
    () => layers.find(({ id }) => id === selectedLayerId),
    [layers, selectedLayerId],
  );

  const isDatasetActive = useMemo(() => {
    if (selectedLayerId === undefined) {
      return false;
    }

    return layersConfiguration.findIndex(({ id }) => id === selectedLayerId) !== -1;
  }, [selectedLayerId, layersConfiguration]);

  const layerReturnPeriods = useMemo(
    () => getReturnPeriods(selectedLayerId, layers),
    [layers, selectedLayerId],
  );

  const onToggleDataset = useCallback(
    (active: boolean) => {
      if (selectedLayerId === undefined) {
        return;
      }

      if (!active) {
        removeLayer(selectedLayerId);
      } else {
        addLayer(selectedLayerId, { ["return-period"]: selectedReturnPeriod });
      }
    },
    [selectedLayerId, addLayer, removeLayer, selectedReturnPeriod],
  );

  const onChangeSelectedLayer = useCallback(
    (stringId: string) => {
      const id = Number.parseInt(stringId);
      const previousId = selectedLayerId;
      const returnPeriod = getDefaultReturnPeriod(id, layers, layersConfiguration);

      setSelectedLayerId(id);
      setSelectedReturnPeriod(returnPeriod);

      // If the dataset was active and the layer is changed, we replace the current layer by the new
      // one keeping all the same settings (visibility, opacity, etc.)
      if (isDatasetActive && previousId !== undefined) {
        updateLayer(previousId, { id, ["return-period"]: returnPeriod });
      }
    },
    [
      selectedLayerId,
      setSelectedLayerId,
      isDatasetActive,
      updateLayer,
      layers,
      layersConfiguration,
    ],
  );

  const onChangeSelectedReturnPeriod = useCallback(
    (stringReturnPeriod: string) => {
      const returnPeriod = Number.parseInt(stringReturnPeriod);

      setSelectedReturnPeriod(returnPeriod);

      if (isDatasetActive && selectedLayerId !== undefined) {
        updateLayer(selectedLayerId, { ["return-period"]: returnPeriod });
      }
    },
    [selectedLayerId, setSelectedReturnPeriod, isDatasetActive, updateLayer],
  );

  return (
    <div className="p-4 border-image-[url(/assets/images/border-image.svg)] border-slice-10 border-image-width-2.5 border-outset-[5px] border-repeat-round">
      <div className="flex items-start justify-between gap-4">
        <Label htmlFor={`${id}-toggle`} className="text-[20px]">
          {name}
        </Label>
        <div className="flex items-center gap-0.5 pt-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn({
              "group/download": true,
              "pointer-events-none opacity-20": !selectedLayer?.attributes!.download_link,
            })}
            aria-disabled={!selectedLayer?.attributes!.download_link}
            tabIndex={!selectedLayer?.attributes!.download_link ? -1 : undefined}
            asChild
          >
            <Link
              href={selectedLayer?.attributes!.download_link ?? ""}
              rel="noopener noreferrer"
              download={selectedLayer?.attributes!.name}
            >
              <span className="sr-only">Download</span>
              <DownloadIcon
                className="!size-4 transition-colors group-hover/download:text-casper-blue-300"
                aria-hidden
              />
            </Link>
          </Button>
          <Switch id={`${id}-toggle`} checked={isDatasetActive} onCheckedChange={onToggleDataset} />
        </div>
      </div>
      <div className="mt-1 flex flex-col gap-1.5">
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
        {!!layerReturnPeriods && (
          <Select
            value={selectedReturnPeriod !== undefined ? `${selectedReturnPeriod}` : ""}
            onValueChange={onChangeSelectedReturnPeriod}
          >
            <SelectTrigger aria-label="Return period">
              <SelectValue placeholder="Select a return period" />
            </SelectTrigger>
            <SelectContent>
              {layerReturnPeriods.options.map((option) => (
                <SelectItem key={option} value={`${option}`}>
                  {`${option}-year return period`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

export default DatasetCard;
