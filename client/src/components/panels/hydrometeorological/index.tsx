import Image from "next/image";

import DatasetCard from "@/components/dataset-card";
import { Skeleton } from "@/components/ui/skeleton";
import useDatasetsBySubTopic from "@/hooks/use-datasets-by-sub-topic";

import HydrometeorologicalImage from "../../../../public/assets/images/hydrometeorological-illustration.png";

const HydrometeorologicalPanel = () => {
  const { data, isLoading } = useDatasetsBySubTopic(
    "hydrometeorological",
    ["name", "params_config", "download_link"],
    true,
  );

  return (
    <div className="min-h-screen px-5 py-5 lg:min-h-0 lg:px-10">
      <p className="mb-6 text-sm leading-[26px]">
        Access comprehensive hydrometeorological data, including precipitation, temperature,
        evapotranspiration, and water levels, to monitor key environmental variables. Analyze
        surface water dynamics, soil moisture, and groundwater storage to support proactive water
        resource and environmental management.
      </p>
      <figure className="relative mx-auto mb-6 w-max max-w-full">
        <Image src={HydrometeorologicalImage} alt="Brown tumultuous water" placeholder="blur" />
        <figcaption className="absolute bottom-0 left-0 bg-rhino-blue-950/10 px-2.5 py-1 text-xs italic text-white backdrop-blur-sm">
          Ivan Bandura
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

export default HydrometeorologicalPanel;
