import Image from "next/image";

import FloodImage from "@/../public/assets/images/flood-illustration.png";
import DatasetCard from "@/components/dataset-card";
import { Skeleton } from "@/components/ui/skeleton";
import useDatasetsBySubTopic from "@/hooks/use-datasets-by-sub-topic";

const FloodPanel = () => {
  const { data, isLoading } = useDatasetsBySubTopic(
    "flood",
    "sub_topic.name:desc,name",
    ["name", "params_config", "download_link"],
    true,
  );

  return (
    <div className="min-h-screen px-5 py-5 lg:min-h-0 lg:px-10">
      <p className="mb-6 text-sm leading-[26px]">
        Access detailed flood data to assess both exposure and hazard levels across South Sudan.
        Analyze model-based and EO-based flood information, including flood extent, depth, and
        return periods, to better understand flood risks and support proactive planning.
      </p>
      <figure className="relative mx-auto mb-6 w-max max-w-full">
        <Image src={FloodImage} alt="Brown tumultuous water" placeholder="blur" />
        <figcaption className="absolute bottom-0 left-0 bg-rhino-blue-950/10 px-2.5 py-1 text-xs italic text-white backdrop-blur-sm">
          Wolfgang Hasselmann
        </figcaption>
      </figure>
      {isLoading && (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-7 w-2/5" />
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-7 w-2/5" />
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      )}
      {!isLoading && (
        <div className="flex flex-col gap-6">
          {data.map(({ subTopic, datasets }) => (
            <div key={subTopic} className="flex flex-col gap-6">
              <h2 className="uppercase">{subTopic}</h2>
              {datasets.map((dataset) => (
                <DatasetCard key={dataset.id} {...dataset} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloodPanel;
