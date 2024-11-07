import DatasetCard from "@/components/dataset-card";
import { Skeleton } from "@/components/ui/skeleton";
import useDatasetsBySubTopic from "@/hooks/use-datasets-by-sub-topic";

const FloodPanel = () => {
  const { data, isLoading } = useDatasetsBySubTopic("flood", ["name", "params_config"]);

  return (
    <div className="min-h-screen px-5 py-5 lg:min-h-0 lg:px-10">
      <p className="mb-6">
        Access detailed flood data to assess both exposure and hazard levels across South Sudan.
        Analyze model-based and EO-based flood information, including flood extent, depth, and
        return periods, to better understand flood risks and support proactive planning.
      </p>
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
