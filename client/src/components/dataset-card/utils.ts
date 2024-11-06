import useMapLayers from "@/hooks/use-map-layers";
import { DatasetLayersDataItem } from "@/types/generated/strapi.schemas";
import { LayerParamsConfig } from "@/types/layer";

export const getDefaultSelectedLayerId = (
  defaultLayerId: number | undefined,
  layers: DatasetLayersDataItem[],
  layersConfiguration: ReturnType<typeof useMapLayers>[0],
) => {
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
};

export const getDefaultReturnPeriod = (
  layerId: number | undefined,
  layers: DatasetLayersDataItem[],
  layersConfiguration: ReturnType<typeof useMapLayers>[0],
) => {
  const layerConfiguration = layersConfiguration.find(({ id }) => id === layerId);

  // If the layer is active and already has a selected return period, we return it
  if (layerConfiguration?.["return-period"] !== undefined) {
    return layerConfiguration["return-period"];
  }

  // Else we look for the default return period stored in `params_config`
  const layer = layers.find(({ id }) => id === layerId);
  const defaultReturnPeriod = (
    layer?.attributes!.params_config as LayerParamsConfig | undefined
  )?.find(({ key }) => key === "return-period");

  if (
    !defaultReturnPeriod ||
    defaultReturnPeriod.default === undefined ||
    defaultReturnPeriod.default === null
  ) {
    return undefined;
  }

  return defaultReturnPeriod.default as number;
};

export const getReturnPeriods = (layerId: number | undefined, layers: DatasetLayersDataItem[]) => {
  const layer = layers.find(({ id }) => id === layerId);
  if (!layer) {
    return undefined;
  }

  const returnPeriod = (layer.attributes!.params_config as LayerParamsConfig | undefined)?.find(
    ({ key }) => key === "return-period",
  );
  if (
    !returnPeriod ||
    returnPeriod.default === undefined ||
    returnPeriod.default === null ||
    returnPeriod.options === undefined ||
    returnPeriod.options === null
  ) {
    return undefined;
  }

  return {
    defaultOption: returnPeriod.default as number,
    options: [...(returnPeriod.options as number[])].sort((a, b) => a - b),
  };
};
