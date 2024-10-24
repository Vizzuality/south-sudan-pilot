import MapSettingsPanel from "@/components/panels/map-settings";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import GlobeIcon from "@/svgs/globe.svg";

const MapSettingsControls = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="yellow" size="icon">
          <span className="sr-only">Map settings</span>
          <GlobeIcon aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="left" align="end" className="w-[250px]">
        <MapSettingsPanel />
      </PopoverContent>
    </Popover>
  );
};

export default MapSettingsControls;
