import { extent } from "d3-array";
import { getYear } from "date-fns";
import { format } from "date-fns/format";
import { useMemo } from "react";

import useLocation from "@/hooks/use-location";
import { useGetLayers } from "@/types/generated/layer";
import { ChartDataLayerDataAttributesChartDataDataItemAttributes } from "@/types/generated/strapi.schemas";

interface YearChartData {
  data: {
    x: string;
    y: number;
  }[];
  unit: string | undefined;
  colorRange: string[];
  colorDomain: [number, number];
}

export default function useYearChartData(layerId?: number, date?: string) {
  const [location] = useLocation();

  const year = useMemo(() => getYear(date ?? new Date()), [date]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore-error
  const { data, isLoading } = useGetLayers<YearChartData>(
    {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-error
      fields: ["chart_unit"],
      populate: {
        legend_config: {
          fields: ["id"],
          populate: {
            items: {
              fields: ["color", "value"],
            },
          },
        },
        chart_data: {
          fields: ["x_values", "y_values"],
          filters: {
            year: {
              $eq: year,
            },
            location_code: {
              $eq: location.code.slice(-1)[0],
            },
          },
          "pagination[limit]": 1,
        },
      },
      filters: {
        id: {
          $eq: layerId,
        },
      },
      "pagination[limit]": 1,
    },
    {
      query: {
        enabled: layerId !== undefined && date !== undefined,
        placeholderData: { data: [] },
        select: (data) => {
          if (!data?.data?.length) {
            return undefined;
          }

          const { attributes: layerAttributes } = data.data[0];
          const legendItems = layerAttributes!.legend_config.items!;

          if (!layerAttributes!.chart_data?.data?.length || !legendItems?.length) {
            return undefined;
          }

          const { data: chartData } = layerAttributes!.chart_data;
          const chartAttributes = chartData[0]
            .attributes! as ChartDataLayerDataAttributesChartDataDataItemAttributes;

          return {
            data: (chartAttributes.x_values as number[]).map((x, index) => ({
              x: format(new Date().setMonth(index), "MMM"),
              y: (chartAttributes.y_values as number[])[index],
            })),
            unit: layerAttributes!.chart_unit,
            colorRange: legendItems.map(({ color }) => color).filter(Boolean),
            colorDomain: [
              Number.isNaN(Number.parseFloat(legendItems[0].value!))
                ? extent(chartAttributes.y_values as number[])[0]
                : Number.parseFloat(legendItems[0].value!),
              Number.isNaN(Number.parseFloat(legendItems.slice(-1)[0].value!))
                ? extent(chartAttributes.y_values as number[])[1]
                : Number.parseFloat(legendItems.slice(-1)[0].value!),
            ],
          };
        },
      },
    },
  );

  return { data, isLoading };
}
