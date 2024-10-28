import { useGetDatasets } from "@/types/generated/dataset";
import { DatasetLayersDataItem } from "@/types/generated/strapi.schemas";

type DatasetsBySubTopic = {
  subTopic: string;
  datasets: { id: number; name: string; layers: DatasetLayersDataItem[] }[];
};

export default function useDatasetsBySubTopic(topicSlug: string, layersFields = ["name"]) {
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
        layers: {
          fields: layersFields,
        },
      },
      filters: {
        topic: {
          slug: {
            $eq: topicSlug,
          },
        },
      },
      sort: "sub_topic.name",
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
            const subTopic = item.attributes!.sub_topic!.data!.attributes!.name!;
            const dataset = item.attributes!.name;
            const layers = item.attributes!.layers!.data!;

            if (currentSubTopic === null || currentSubTopic !== subTopic) {
              currentSubTopic = subTopic;
              currentIndex++;
              res[currentIndex] = { subTopic: currentSubTopic, datasets: [] };
            }

            res[currentIndex].datasets.push({
              id: item.id!,
              name: dataset,
              layers,
            });
          }

          return res;
        },
      },
    },
  );

  return { data, isLoading };
}
