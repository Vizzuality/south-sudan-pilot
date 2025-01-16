"use client";

import { getYear } from "date-fns";
import { camelCase } from "lodash-es";
import * as React from "react";
import { useCallback, useMemo, useState } from "react";

import InteractionChart from "@/components/interaction-chart";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import YearChart from "@/components/year-chart";
import useInteractionChartData from "@/hooks/use-interaction-chart-data";
import useLayerInteractionState from "@/hooks/use-layer-interaction-state";
import useLocation from "@/hooks/use-location";
import { useLocationByCodes } from "@/hooks/use-location-by-codes";
import useMapLayers from "@/hooks/use-map-layers";
import useYearChartData from "@/hooks/use-year-chart-data";
import CursorArrowRaysIcon from "@/svgs/cursor-arrow-rays.svg";
import { DatasetLayersDataItem, MetadataItemComponent } from "@/types/generated/strapi.schemas";

import ChartSentence from "./chart-sentence";
import DateControls from "./date-controls";
import DownloadChartButton from "./download-chart-button";
import DownloadLayerButton from "./download-layer-button";
import MetadataButton from "./metadata-button";
import {
  getDefaultDate,
  getDefaultReturnPeriod,
  getDefaultSelectedLayerId,
  getReturnPeriods,
} from "./utils";

interface DatasetCardProps {
  id: number;
  name: string;
  shortDescription?: string;
  defaultLayerId: number | undefined;
  layers: DatasetLayersDataItem[];
  metadata?: MetadataItemComponent;
}

const DatasetCard = ({
  id,
  name,
  shortDescription,
  defaultLayerId,
  layers,
  metadata,
}: DatasetCardProps) => {
  const [layersConfiguration, { addLayer, updateLayer, removeLayer }] = useMapLayers();
  const [location] = useLocation();

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

  const [{ selectedFeature }, { setHoveredFeature, setSelectedFeature }] =
    useLayerInteractionState(selectedLayerId);

  const selectedLayer = useMemo(
    () => layers.find(({ id }) => id === selectedLayerId),
    [layers, selectedLayerId],
  );

  const showChartOnInteraction = useMemo(
    () => selectedLayer?.attributes!.show_chart_on_interaction ?? false,
    [selectedLayer],
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

  const { data: yearChartData, isLoading: yearChartIsLoading } = useYearChartData(
    selectedLayerId,
    selectedDate,
  );

  const { data: interactionChartData, isLoading: interactionChartIsLoading } =
    useInteractionChartData(selectedLayer, selectedFeature);

  const { data: locationData, isLoading: locationIsLoading } = useLocationByCodes(
    location.code.slice(-1),
  );

  const isChartDownloadVisible = useMemo(() => {
    return (
      ((showChartOnInteraction && selectedFeature) ||
        (!showChartOnInteraction && selectedDate !== undefined && selectedLayerId !== undefined)) &&
      selectedLayer !== undefined &&
      selectedLayer!.attributes!.allow_chart_data_download
    );
  }, [selectedDate, selectedFeature, selectedLayerId, showChartOnInteraction, selectedLayer]);

  const isChartDownloadDisabled = useMemo(() => {
    const isInteractionChartDownloadDisabled =
      showChartOnInteraction && (interactionChartIsLoading || !interactionChartData);

    const isYearChartDownloadDisabled =
      !showChartOnInteraction &&
      (yearChartIsLoading ||
        !yearChartData ||
        locationIsLoading ||
        !locationData ||
        locationData.length === 0);

    return isInteractionChartDownloadDisabled || isYearChartDownloadDisabled;
  }, [
    interactionChartData,
    interactionChartIsLoading,
    locationData,
    locationIsLoading,
    showChartOnInteraction,
    yearChartData,
    yearChartIsLoading,
  ]);

  const downloadableChartData = useMemo(() => {
    if (isChartDownloadDisabled) {
      return;
    }

    return {
      dataset: name,
      datasetMetadata: Object.entries(metadata ?? {}).reduce((res, [key, value]) => {
        if (key === "id") {
          return res;
        }

        return {
          ...res,
          [camelCase(key)]: value,
        };
      }, {}),
      ...(!showChartOnInteraction
        ? {
            year: getYear(selectedDate!),
            location: locationData![0].name,
            ...yearChartData,
          }
        : {}),
      ...(showChartOnInteraction
        ? {
            feature: selectedFeature,
            ...interactionChartData,
          }
        : {}),
    };
  }, [
    interactionChartData,
    isChartDownloadDisabled,
    locationData,
    metadata,
    name,
    selectedDate,
    selectedFeature,
    showChartOnInteraction,
    yearChartData,
  ]);

  const downloadableChartDataFileName = useMemo(() => {
    if (isChartDownloadDisabled) {
      return "";
    }

    return `${name}${!showChartOnInteraction ? ` - ${locationData![0].name}` : ""}.json`;
  }, [isChartDownloadDisabled, locationData, name, showChartOnInteraction]);

  const isInteractionChartVisible = useMemo(
    () => showChartOnInteraction && selectedLayer !== undefined && !!selectedFeature,
    [selectedFeature, selectedLayer, showChartOnInteraction],
  );

  const isYearChartVisible = useMemo(
    () => selectedDate !== undefined && selectedLayerId !== undefined,
    [selectedDate, selectedLayerId],
  );

  const onToggleDataset = useCallback(
    (active: boolean) => {
      if (selectedLayerId === undefined) {
        return;
      }

      if (!active) {
        removeLayer(selectedLayerId);
        setHoveredFeature(null);
        setSelectedFeature(null);
      } else {
        addLayer(selectedLayerId, { ["return-period"]: selectedReturnPeriod, date: selectedDate });
      }
    },
    [
      selectedLayerId,
      addLayer,
      removeLayer,
      selectedReturnPeriod,
      selectedDate,
      setHoveredFeature,
      setSelectedFeature,
    ],
  );

  const onChangeSelectedLayer = useCallback(
    (stringId: string) => {
      const id = Number.parseInt(stringId);
      const previousId = selectedLayerId;
      const returnPeriod = getDefaultReturnPeriod(id, layers, layersConfiguration);
      const date = getDefaultDate(id, layers, layersConfiguration);

      // We reset the hovered and selected features for the previous layer
      setHoveredFeature(null);
      setSelectedFeature(null);

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
      setHoveredFeature,
      setSelectedFeature,
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

  const onChangeDate = useCallback(
    (date: string) => {
      setSelectedDate(date);
      if (selectedLayerId !== undefined) {
        updateLayer(selectedLayerId, { date });
      }
    },
    [updateLayer, selectedLayerId, setSelectedDate],
  );

  return (
    <div className="p-4 border-image-[url(/assets/images/border-image.svg)] border-slice-10 border-image-width-2.5 border-outset-[5px] border-repeat-round">
      <div className="flex items-start justify-between gap-4">
        <Label htmlFor={`dataset-${id}-toggle`} className="text-[20px]">
          {name}
        </Label>
        <div className="flex items-center gap-1 pt-1.5">
          {isChartDownloadVisible && (
            <DownloadChartButton
              data={downloadableChartData}
              fileName={downloadableChartDataFileName}
              disabled={isChartDownloadDisabled}
            />
          )}
          {selectedLayer !== undefined && !!selectedLayer.attributes!.download_link && (
            <DownloadLayerButton
              link={selectedLayer.attributes!.download_link}
              fileName={selectedLayer.attributes!.name!}
            />
          )}
          {!!metadata && <MetadataButton datasetName={name} metadata={metadata} />}
          {(!!selectedLayer?.attributes!.download_link || !!metadata) && (
            <div className="mx-0.5 h-5 w-px bg-casper-blue-400" />
          )}
          <Switch
            id={`dataset-${id}-toggle`}
            checked={isDatasetActive}
            onCheckedChange={onToggleDataset}
          />
        </div>
      </div>
      {!!shortDescription && <div className="mt-1 text-sm">{shortDescription}</div>}
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
        {isDatasetActive && showChartOnInteraction && selectedLayer !== undefined && (
          <div className="mt-3 flex items-center justify-start gap-2 text-xs text-casper-blue-800">
            <CursorArrowRaysIcon className="size-4" aria-hidden />
            Select a point on the map for details.
          </div>
        )}
        {isInteractionChartVisible && (
          <div className="mt-3">
            <InteractionChart data={interactionChartData} loading={interactionChartIsLoading} />
          </div>
        )}
        {isYearChartVisible && (
          <div className="mt-3">
            <YearChart
              data={yearChartData}
              date={selectedDate!}
              loading={yearChartIsLoading}
              active={isDatasetActive}
            />
          </div>
        )}
        {isDatasetActive &&
          (isInteractionChartVisible || isYearChartVisible) &&
          selectedLayer !== undefined &&
          !!selectedLayer.attributes!.chart_sentence && (
            <div className="mt-0.5">
              <ChartSentence
                sentence={selectedLayer.attributes!.chart_sentence}
                feature={selectedFeature}
              />
            </div>
          )}
        {isDatasetActive && selectedLayer !== undefined && selectedDate !== undefined && (
          <DateControls layer={selectedLayer} date={selectedDate} onChangeDate={onChangeDate} />
        )}
      </div>
    </div>
  );
};

export default DatasetCard;
