import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import useLayerLegend from "@/hooks/use-layer-legend";
import useMapLayers from "@/hooks/use-map-layers";
import EyeSlashedIcon from "@/svgs/eye-slashed.svg";
import EyeIcon from "@/svgs/eye.svg";
import HandleIcon from "@/svgs/handle.svg";
import OpacityIcon from "@/svgs/opacity.svg";
import { LayerSettings } from "@/types/layer";

import BasicLegend from "./basic-legend";
import ChoroplethLegend from "./choropleth-legend";
import GradientLegend from "./gradient-legend";

interface LegendItemProps {
  id: number;
  settings: LayerSettings;
}

const LegendItem = ({ id, settings }: LegendItemProps) => {
  const { data, isLoading } = useLayerLegend(id);
  const [, { updateLayer }] = useMapLayers();

  if (!isLoading && !data) {
    return null;
  }

  return (
    <div className="flex items-start gap-2 px-2.5 py-2 font-sans text-sm">
      <Button type="button" variant="ghost" size="auto" className="relative top-1 shrink-0">
        <span className="sr-only">Grab to reorder the layer</span>
        <HandleIcon className="!h-3 !w-auto text-casper-blue-400" aria-hidden />
      </Button>
      <div className="flex-grow overflow-hidden">
        {isLoading && (
          <div className="flex justify-between">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-[36px]" />
          </div>
        )}
        {!isLoading && (
          <div className="flex items-center gap-2">
            <div
              className="flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap"
              title={data.topicSlug === "contextual" ? data.name : data.dataset}
            >
              {data.topicSlug === "contextual" ? data.name : data.dataset}
            </div>
            <div className="flex shrink-0 gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="ghost" size="icon-sm" className="group">
                    <span className="sr-only">Change opacity</span>
                    <OpacityIcon
                      className="!size-4 transition-colors group-hover:text-casper-blue-300"
                      aria-hidden
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  sideOffset={8}
                  variant="dark"
                  className="w-32 px-2.5 pb-2.5 pt-2"
                >
                  <Label htmlFor="opacity-slider" className="text-xs">
                    Opacity
                  </Label>
                  <Slider
                    id="opacity-slider"
                    value={[settings.opacity]}
                    onValueChange={([value]) => updateLayer(id, { opacity: value })}
                  />
                  <PopoverArrow variant="dark" />
                </PopoverContent>
              </Popover>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="group"
                aria-pressed={!settings.visibility}
                onClick={() => updateLayer(id, { visibility: !settings.visibility })}
              >
                <span className="sr-only">Hide</span>
                {settings.visibility && (
                  <EyeIcon
                    className="!size-4 transition-colors group-hover:text-casper-blue-300"
                    aria-hidden
                  />
                )}
                {!settings.visibility && (
                  <EyeSlashedIcon
                    className="!size-4 transition-colors group-hover:text-casper-blue-300"
                    aria-hidden
                  />
                )}
              </Button>
            </div>
          </div>
        )}
        {!isLoading && data.topicSlug !== "contextual" && (
          <div className="mt-1 text-xs">{data.name}</div>
        )}
        <div className="mt-1">
          {isLoading && (
            <>
              <Skeleton className="ml-auto h-4 w-1/12" />
              <Skeleton className="mt-1 h-3 w-full" />
              <Skeleton className="mt-1 h-4 w-full" />
            </>
          )}
          {!isLoading && !!data.items?.length && (
            <>
              {data.type === "basic" && <BasicLegend {...data} />}
              {data.type === "choropleth" && <ChoroplethLegend {...data} />}
              {data.type === "gradient" && <GradientLegend {...data} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegendItem;
