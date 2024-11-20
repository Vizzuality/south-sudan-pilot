"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import useDatasetsBySubTopic from "@/hooks/use-datasets-by-sub-topic";
import XMarkIcon from "@/svgs/xmark.svg";

import Item from "./item";

const ContextualLayersPanel = () => {
  const { data, isLoading } = useDatasetsBySubTopic(
    "contextual",
    "sub_topic.name,name",
    ["layer", "download_link"],
    true,
  );

  return (
    <>
      <SheetHeader className="flex items-center justify-between">
        <SheetTitle
          className={buttonVariants({ variant: "yellow", className: "text-base xl:sr-only" })}
        >
          Contextual layers
        </SheetTitle>
        <SheetClose asChild>
          <Button
            type="button"
            variant="yellow"
            className="w-8 font-sans text-base transition-transform duration-500 ease-out xl:relative xl:w-auto xl:gap-5 xl:pr-10 xl:group-data-[state=open]:-translate-x-12"
          >
            <XMarkIcon aria-hidden className="!size-5 xl:!size-6" />
            <span className="sr-only">Close</span>
            <span aria-hidden className="hidden xl:inline">
              Contextual layers
            </span>
          </Button>
        </SheetClose>
      </SheetHeader>

      <p className="mt-11 leading-[26px]">
        Toggle on and off contextual layers to add demographic, land use, and soil property data to
        your map view. These layers provide additional insights, helping to understand population
        dynamics, land cover, and soil characteristics, which are essential for comprehensive water
        resource analysis.
      </p>

      {isLoading && (
        <>
          <Skeleton className="mt-6 h-6 w-1/2" />
          <Skeleton className="mt-2 h-6 w-1/3" />
          <Skeleton className="mt-2 h-6 w-2/3" />
          <Skeleton className="mt-6 h-6 w-1/2" />
          <Skeleton className="mt-2 h-6 w-1/3" />
          <Skeleton className="mt-2 h-6 w-2/3" />
          <Skeleton className="mt-6 h-6 w-1/2" />
          <Skeleton className="mt-2 h-6 w-1/3" />
          <Skeleton className="mt-2 h-6 w-2/3" />
        </>
      )}

      {!isLoading && data.length === 0 && (
        <div className="py-11 text-center font-semibold">Data not available</div>
      )}

      {!isLoading && data.length > 0 && (
        <div className="mt-6 flex flex-col gap-2">
          {data.map(({ subTopic, datasets }) => (
            <Item
              key={subTopic}
              name={subTopic}
              layers={datasets
                .filter((dataset) => dataset.layers.length > 0)
                .map((dataset) => ({
                  // Assuming the dataset has just one layer, which is currently the case
                  id: dataset.layers[0].id!,
                  name: dataset.layers[0].attributes!.name!,
                  downloadLink: dataset.layers[0].attributes!.download_link,
                  metadata: dataset.metadata,
                }))}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ContextualLayersPanel;
