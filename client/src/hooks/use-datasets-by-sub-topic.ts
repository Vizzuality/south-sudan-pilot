import { useGetDatasets } from "@/types/generated/dataset";
import { DatasetLayersDataItem, MetadataItemComponent } from "@/types/generated/strapi.schemas";

type DatasetsBySubTopic = {
  subTopic: string;
  datasets: {
    id: number;
    name: string;
    defaultLayerId: number | undefined;
    layers: DatasetLayersDataItem[];
    metadata?: MetadataItemComponent;
  }[];
};

export default function useDatasetsBySubTopic(
  topicSlug: string,
  sort = "sub_topic.name,name",
  layersFields = ["name"],
  includeMetadata = false,
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore-error
  const { data, isLoading } = useGetDatasets<DatasetsBySubTopic[]>(
    {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-error
      fields: ["name"],
      populate: {
        sub_topic: {
          fields: ["name"],
        },
        default_layer: {
          fields: ["id"],
        },
        layers: {
          fields: layersFields,
          sort: "name",
        },
        metadata: includeMetadata,
      },
      filters: {
        topic: {
          slug: {
            $eq: topicSlug,
          },
        },
      },
      sort,
    },
    {
      query: {
        placeholderData: { data: [] },
        select: (data) => {
          const res: DatasetsBySubTopic[] = [];

          if (!data?.data) {
            return res;
          }

          let currentIndex = -1;
          let currentSubTopic = null;

          for (const item of data.data) {
            const subTopic = item.attributes!.sub_topic!.data!.attributes!.name! as string;
            const dataset = item.attributes!.name;
            const defaultLayerId = item.attributes!.default_layer!.data?.id;
            const layers = item.attributes!.layers!.data!;
            const metadata = item.attributes!.metadata;

            if (currentSubTopic === null || currentSubTopic !== subTopic) {
              currentSubTopic = subTopic;
              currentIndex++;
              res[currentIndex] = { subTopic: currentSubTopic, datasets: [] };
            }

            res[currentIndex].datasets.push({
              id: item.id!,
              name: dataset,
              defaultLayerId,
              layers,
              ...(includeMetadata ? { metadata: metadata ?? undefined } : {}),
            });
          }

          return res;
        },
      },
    },
  );

  return { data, isLoading };
}
