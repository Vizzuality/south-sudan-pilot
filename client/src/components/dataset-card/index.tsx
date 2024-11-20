"use client";

import { getMonth } from "date-fns";
import { format } from "date-fns/format";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as React from "react";

import DatasetMetadata from "@/components/dataset-metadata";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import MonthPicker from "@/components/ui/month-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import CalendarDaysIcon from "@/svgs/calendar-days.svg";
import ChevronDownIcon from "@/svgs/chevron-down.svg";
import DownloadIcon from "@/svgs/download.svg";
import PauseIcon from "@/svgs/pause.svg";
import PlayIcon from "@/svgs/play.svg";
import QuestionMarkIcon from "@/svgs/question-mark.svg";
import { DatasetLayersDataItem, MetadataItemComponent } from "@/types/generated/strapi.schemas";
import { LayerParamsConfig } from "@/types/layer";

import {
  getDefaultReturnPeriod,
  getDefaultSelectedLayerId,
  getReturnPeriods,
  getDefaultDate,
} from "./utils";

interface DatasetCardProps {
  id: number;
  name: string;
  defaultLayerId: number | undefined;
  layers: DatasetLayersDataItem[];
  metadata?: MetadataItemComponent;
}

const DatasetCard = ({ id, name, defaultLayerId, layers, metadata }: DatasetCardProps) => {
  const [layersConfiguration, { addLayer, updateLayer, removeLayer }] = useMapLayers();

  const defaultSelectedLayerId = useMemo(
    () => getDefaultSelectedLayerId(defaultLayerId, layers, layersConfiguration),
    [layers, defaultLayerId, layersConfiguration],
  );

  const defaultSelectedReturnPeriod = useMemo(
    () => getDefaultReturnPeriod(defaultSelectedLayerId, layers, layersConfiguration),
    [layers, layersConfiguration, defaultSelectedLayerId],
  );

  const defaultSelectedDate = useMemo(
    () => getDefaultDate(defaultSelectedLayerId, layers, layersConfiguration),
    [layers, layersConfiguration, defaultSelectedLayerId],
  );

  const [selectedLayerId, setSelectedLayerId] = useState(defaultSelectedLayerId);
  const [selectedReturnPeriod, setSelectedReturnPeriod] = useState(defaultSelectedReturnPeriod);
  const [selectedDate, setSelectedDate] = useState(defaultSelectedDate);
  const [isAnimated, setIsAnimated] = useState(false);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Date that was selected before the animation is played
  const dateBeforeAnimationRef = useRef<string | null>(null);

  const selectedLayer = useMemo(
    () => layers.find(({ id }) => id === selectedLayerId),
    [layers, selectedLayerId],
  );

  const dateRange = useMemo(() => {
    if (!selectedLayer) {
      return undefined;
    }

    const paramsConfig = selectedLayer.attributes!.params_config! as LayerParamsConfig;
    return paramsConfig.find(({ key }) => key === "date-range")?.default as [string, string];
  }, [selectedLayer]);

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
        addLayer(selectedLayerId, { ["return-period"]: selectedReturnPeriod, date: selectedDate });
      }
    },
    [selectedLayerId, addLayer, removeLayer, selectedReturnPeriod, selectedDate],
  );

  const onChangeSelectedLayer = useCallback(
    (stringId: string) => {
      const id = Number.parseInt(stringId);
      const previousId = selectedLayerId;
      const returnPeriod = getDefaultReturnPeriod(id, layers, layersConfiguration);
      const date = getDefaultDate(id, layers, layersConfiguration);

      setSelectedLayerId(id);
      setSelectedReturnPeriod(returnPeriod);

      // If the dataset was active and the layer is changed, we replace the current layer by the new
      // one keeping all the same settings (visibility, opacity, etc.)
      if (isDatasetActive && previousId !== undefined) {
        updateLayer(previousId, { id, ["return-period"]: returnPeriod, date });
      } else {
        addLayer(id, { ["return-period"]: returnPeriod, date });
      }
    },
    [
      selectedLayerId,
      setSelectedLayerId,
      isDatasetActive,
      updateLayer,
      addLayer,
      layers,
      layersConfiguration,
    ],
  );

  const onChangeSelectedReturnPeriod = useCallback(
    (stringReturnPeriod: string) => {
      const returnPeriod = Number.parseInt(stringReturnPeriod);
      const date = getDefaultDate(selectedLayerId, layers, layersConfiguration);

      setSelectedReturnPeriod(returnPeriod);

      if (isDatasetActive && selectedLayerId !== undefined) {
        updateLayer(selectedLayerId, { ["return-period"]: returnPeriod });
      } else if (selectedLayerId !== undefined) {
        addLayer(selectedLayerId, { ["return-period"]: returnPeriod, date });
      }
    },
    [
      selectedLayerId,
      setSelectedReturnPeriod,
      isDatasetActive,
      addLayer,
      updateLayer,
      layers,
      layersConfiguration,
    ],
  );

  const onChangeSelectedDate = useCallback(
    (date: string) => {
      const returnPeriod = getDefaultReturnPeriod(selectedLayerId, layers, layersConfiguration);

      setSelectedDate(date);

      if (isDatasetActive && selectedLayerId !== undefined) {
        updateLayer(selectedLayerId, { date });
      } else if (selectedLayerId !== undefined) {
        addLayer(selectedLayerId, { ["return-period"]: returnPeriod, date });
      }
    },
    [selectedLayerId, isDatasetActive, addLayer, updateLayer, layers, layersConfiguration],
  );

  const onToggleAnimation = useCallback(() => {
    const newIsAnimated = !isAnimated;

    if (newIsAnimated) {
      dateBeforeAnimationRef.current = selectedDate !== undefined ? selectedDate : null;
    } else {
      dateBeforeAnimationRef.current = null;
    }

    setIsAnimated(newIsAnimated);
  }, [selectedDate, isAnimated, setIsAnimated]);

  // When the layer is animated, show each month of the year in a loop
  useEffect(() => {
    if (isAnimated && selectedDate !== undefined && selectedLayerId !== undefined) {
      animationIntervalRef.current = setInterval(() => {
        const date = format(
          new Date(selectedDate).setMonth((getMonth(selectedDate) + 1) % 12),
          "yyyy-MM-dd",
        );

        setSelectedDate(date);
        updateLayer(selectedLayerId, { date });
      }, 500);
    } else if (animationIntervalRef.current !== null) {
      clearInterval(animationIntervalRef.current);
    }

    return () => {
      if (animationIntervalRef.current !== null) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [selectedLayerId, selectedDate, isAnimated, setSelectedDate, updateLayer]);

  return (
    <div className="p-4 border-image-[url(/assets/images/border-image.svg)] border-slice-10 border-image-width-2.5 border-outset-[5px] border-repeat-round">
      <div className="flex items-start justify-between gap-4">
        <Label htmlFor={`dataset-${id}-toggle`} className="text-[20px]">
          {name}
        </Label>
        <div className="flex items-center gap-0.5 pt-1">
          {!!selectedLayer?.attributes!.download_link && (
            <Button variant="ghost" size="icon-sm" className="group/download" asChild>
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
          )}
          {!!metadata && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="group/info">
                  <span className="sr-only">Information</span>
                  <QuestionMarkIcon
                    className="!size-4 transition-colors group-hover/info:text-casper-blue-300"
                    aria-hidden
                  />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DatasetMetadata name={name} metadata={metadata} />
              </DialogContent>
            </Dialog>
          )}
          <Switch
            id={`dataset-${id}-toggle`}
            checked={isDatasetActive}
            onCheckedChange={onToggleDataset}
          />
        </div>
      </div>
      <div className="mt-1 flex flex-col gap-1.5">
        {layers.length > 1 && (
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
        )}
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
        {selectedDate !== undefined && dateRange !== undefined && isDatasetActive && (
          <div className="flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="ghost"
              size="auto"
              className="hidden h-6 w-6 rounded-full border border-rhino-blue-950 hover:border-rhino-blue-800 hover:text-rhino-blue-800 lg:inline-flex"
              aria-pressed={isAnimated}
              onClick={onToggleAnimation}
            >
              <span className="sr-only">Play layer animation</span>
              {!isAnimated && <PlayIcon className="!size-4 transition-colors" aria-hidden />}
              {isAnimated && <PauseIcon className="!size-4 transition-colors" aria-hidden />}
            </Button>
            <div className="flex w-full items-center gap-2 lg:w-auto">
              <Label
                htmlFor={`dataset-${id}-date`}
                className={cn({
                  "shrink-0 text-xs font-medium": true,
                  "pointer-events-none opacity-60": isAnimated,
                })}
              >
                Displayed on map
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id={`dataset-${id}-date`}
                    type="button"
                    variant="yellow"
                    className="group/month-picker max-w-[220px] flex-grow justify-between px-3 disabled:bg-rhino-blue-50 disabled:text-rhino-blue-950/60 disabled:opacity-100 lg:flex-grow-0 xl:h-auto xl:py-1.5"
                    disabled={isAnimated}
                  >
                    <CalendarDaysIcon aria-hidden />
                    {format(
                      isAnimated ? dateBeforeAnimationRef.current! : selectedDate,
                      "MMMM, yyyy",
                    )}
                    <ChevronDownIcon
                      className="ml-auto group-data-[state=open]/month-picker:rotate-180"
                      aria-hidden
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="end" sideOffset={2} className="w-[220px]">
                  <MonthPicker
                    selected={isAnimated ? dateBeforeAnimationRef.current! : selectedDate}
                    minDate={dateRange[0]}
                    maxDate={dateRange[1]}
                    onSelect={onChangeSelectedDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetCard;
