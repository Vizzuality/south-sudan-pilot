import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useMapLayers from "@/hooks/use-map-layers";
import { cn } from "@/lib/utils";
import DownloadIcon from "@/svgs/download.svg";
import { Dataset, Layer } from "@/types/generated/strapi.schemas";

interface ItemProps {
  name: Dataset["name"];
  layers: { id: number; name: Layer["name"]; downloadLink?: Layer["download_link"] }[];
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
            <div className="flex items-center gap-0.5 pt-1">
              <Button
                variant="ghost"
                size="icon-sm"
                className={cn({
                  "group/download": true,
                  "pointer-events-none opacity-20": !layer.downloadLink,
                })}
                aria-disabled={!layer.downloadLink}
                tabIndex={!layer.downloadLink ? -1 : undefined}
                asChild
              >
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
