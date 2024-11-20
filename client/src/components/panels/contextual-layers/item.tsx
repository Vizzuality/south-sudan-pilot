import Link from "next/link";
import * as React from "react";

import DatasetMetadata from "@/components/dataset-metadata";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useMapLayers from "@/hooks/use-map-layers";
import DownloadIcon from "@/svgs/download.svg";
import QuestionMarkIcon from "@/svgs/question-mark.svg";
import { Dataset, Layer, MetadataItemComponent } from "@/types/generated/strapi.schemas";

interface ItemProps {
  name: Dataset["name"];
  layers: {
    id: number;
    name: Layer["name"];
    downloadLink?: Layer["download_link"];
    metadata?: MetadataItemComponent;
  }[];
}

const Item = ({ name, layers }: ItemProps) => {
  const [layersConfiguration, { addLayer, removeLayer }] = useMapLayers();

  return (
    <div>
      <div className="border-b border-casper-blue-400/50 py-2 uppercase">{name}</div>
      <ul className="py-2">
        {layers.map((layer) => (
          <li key={layer.id} className="flex items-start justify-between gap-4 py-2">
            <Label htmlFor={`${layer.id}-toggle`} className="text-xl">
              {layer.name}
            </Label>
            <div className="flex items-center gap-1 pt-1.5">
              {!!layer.downloadLink && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon-sm" className="group/download" asChild>
                        <Link
                          href={layer.downloadLink ?? ""}
                          rel="noopener noreferrer"
                          download={layer.name}
                        >
                          <span className="sr-only">Download</span>
                          <DownloadIcon
                            className="!size-4 transition-colors group-hover/download:text-casper-blue-300"
                            aria-hidden
                          />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download dataset</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {!!layer.metadata && (
                <Dialog>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon-sm" className="group/info">
                            <span className="sr-only">Information</span>
                            <QuestionMarkIcon
                              className="!size-4 transition-colors group-hover/info:text-casper-blue-300"
                              aria-hidden
                            />
                          </Button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>More info</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <DialogContent>
                    <DatasetMetadata name={name} metadata={layer.metadata} />
                  </DialogContent>
                </Dialog>
              )}
              {(!!layer.downloadLink || !!layer.metadata) && (
                <div className="mx-0.5 h-5 w-px bg-casper-blue-400" />
              )}
              <Switch
                id={`${layer.id}-toggle`}
                checked={layersConfiguration.findIndex(({ id }) => id === layer.id) !== -1}
                onCheckedChange={(checked) =>
                  checked ? addLayer(layer.id) : removeLayer(layer.id)
                }
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Item;
