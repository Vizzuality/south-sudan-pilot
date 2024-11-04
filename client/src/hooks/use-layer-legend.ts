import { useGetLayers } from "@/types/generated/layer";
import { LegendLegendConfigComponent } from "@/types/generated/strapi.schemas";

export default function useLayerLegend(id: number) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return useGetLayers<{
    name: string;
    dataset: string;
    topicSlug: string;
    type: LegendLegendConfigComponent["type"];
    unit: string;
    items: LegendLegendConfigComponent["items"];
  }>(
    {
      fields: ["name"],
      populate: {
        legend_config: {
          populate: {
            items: true,
          },
        },
        dataset: {
          fields: ["name"],
          populate: {
            topic: {
              fields: ["slug"],
            },
          },
        },
      },
      filters: {
        id: {
          $eq: id,
        },
      },
      "pagination[limit]": 1,
    },
    {
      query: {
        select: (data) => {
          if (!data?.data?.length) {
            return undefined;
          }

          const { name, dataset, legend_config } = data.data[0].attributes!;
          const { name: datasetName, topic } = dataset!.data!.attributes!;
          const { slug: topicSlug } = topic!.data!.attributes!;
          const { type, unit, items } = legend_config!;

          return {
            name,
            dataset: datasetName,
            topicSlug,
            type,
            unit,
            items,
          };
        },
      },
    },
  );
}
