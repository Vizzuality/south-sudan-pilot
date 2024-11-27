import { GeoJsonProperties } from "geojson";
import { useMemo } from "react";

import { useGetLayers } from "@/types/generated/layer";
import {
  ChartDataLayerDataAttributesChartDataDataItemAttributes,
  DatasetLayersDataItem,
} from "@/types/generated/strapi.schemas";
import { LayerParamsConfig } from "@/types/layer";

interface InteractionChartData {
  data: {
    x: string;
    y: number;
  }[];
  unit: string | undefined;
}

export default function useInteractionChartData(
  layer?: DatasetLayersDataItem,
  feature?: GeoJsonProperties | null,
) {
  const identifier = useMemo(() => {
    if (!layer || !feature) {
      return undefined;
    }

    const paramsConfig = layer.attributes!.params_config as LayerParamsConfig;
    const featureId = paramsConfig.find(({ key }) => key === "feature-id")?.default as
      | string
      | undefined;

    if (!featureId) {
      return undefined;
    }

    return feature[featureId];
  }, [layer, feature]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore-error
  const { data, isLoading } = useGetLayers<InteractionChartData>(
    {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-error
      fields: ["chart_unit"],
      populate: {
        chart_data: {
          fields: ["x_values", "y_values"],
          filters: {
            unique_identifier: {
              $eq: identifier,
            },
          },
          "pagination[limit]": 1,
        },
      },
      filters: {
        id: {
          $eq: layer?.id,
        },
      },
      "pagination[limit]": 1,
    },
    {
      query: {
        enabled: layer !== undefined && feature !== undefined && feature !== null,
        placeholderData: { data: [] },
        select: (data) => {
          if (!data?.data?.length) {
            return undefined;
          }

          const { attributes: layerAttributes } = data.data[0];

          if (!layerAttributes!.chart_data?.data?.length) {
            return undefined;
          }

          const { data: chartData } = layerAttributes!.chart_data;
          const chartAttributes = chartData[0]
            .attributes! as ChartDataLayerDataAttributesChartDataDataItemAttributes;

          return {
            data: (chartAttributes.x_values as number[]).map((x, index) => ({
              x,
              y: (chartAttributes.y_values as number[])[index],
            })),
            unit: layerAttributes!.chart_unit,
          };
        },
      },
    },
  );

  return { data, isLoading };
}
