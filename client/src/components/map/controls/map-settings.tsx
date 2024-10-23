import { PropsWithChildren } from "react";

import { Button } from "@/components/ui/button";
import GlobeIcon from "@/svgs/globe.svg";

const MapSettingsPanel = ({ children }: PropsWithChildren) => {
  return children;
};

const MapSettingsControls = () => {
  return (
    <MapSettingsPanel>
      <Button type="button" variant="yellow" size="icon">
        <span className="sr-only">Map settings</span>
        <GlobeIcon aria-hidden />
      </Button>
    </MapSettingsPanel>
  );
};

export default MapSettingsControls;
