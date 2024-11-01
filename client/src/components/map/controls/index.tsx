import useMapLayers from "@/hooks/use-map-layers";
import { cn } from "@/lib/utils";

import ContextualLayersControls from "./contextual-layers";
import LegendControls from "./legend";
import MapSettingsControls from "./map-settings";
import ZoomControls from "./zoom";

const Controls = () => {
  const [layers] = useMapLayers();

  return (
    <>
      <div
        className={cn({
          "absolute right-5 z-10 leading-none xl:bottom-auto xl:right-10 xl:top-6": true,
          "bottom-[120px]": layers.length > 0,
          "bottom-[80px]": layers.length === 0,
        })}
      >
        <ContextualLayersControls />
      </div>
      <div className="absolute bottom-10 right-5 z-10 flex flex-col items-end gap-2 xl:bottom-6 xl:right-10">
        <ZoomControls />
        <div className="flex flex-col gap-2 xl:flex-row-reverse xl:gap-6">
          <MapSettingsControls />
          <LegendControls />
        </div>
      </div>
    </>
  );
};

export default Controls;
