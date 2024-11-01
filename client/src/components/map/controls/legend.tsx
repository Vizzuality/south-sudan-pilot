import Legend from "@/components/map/legend";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useMapLayers from "@/hooks/use-map-layers";
import { Media, MediaContextProvider } from "@/media";
import ChevronDownIcon from "@/svgs/chevron-down.svg";
import ListBulletIcon from "@/svgs/list-bullet.svg";

const LegendControls = () => {
  const [layers] = useMapLayers();

  if (layers.length === 0) {
    return null;
  }

  return (
    <MediaContextProvider>
      <Media lessThan="xl" className="leading-none">
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="yellow" className="w-8 font-sans">
              <span className="sr-only">Legend</span>
              <ListBulletIcon aria-hidden />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="left" align="end" className="w-[250px]">
            <Legend />
          </PopoverContent>
        </Popover>
      </Media>
      <Media greaterThanOrEqual="xl" className="relative">
        <Collapsible className="absolute bottom-0 right-0" defaultOpen>
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="yellow-alt"
              className="group w-[250px] justify-between font-sans"
            >
              <span>Legend</span>
              <ChevronDownIcon aria-hidden className="group-data-[state=closed]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="border-t border-t-casper-blue-400 bg-white">
            <Legend />
          </CollapsibleContent>
        </Collapsible>
      </Media>
    </MediaContextProvider>
  );
};

export default LegendControls;
