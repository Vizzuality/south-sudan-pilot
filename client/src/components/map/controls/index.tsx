import ContextualLayersControls from "./contextual-layers";
import LegendControls from "./legend";
import MapSettingsControls from "./map-settings";
import ZoomControls from "./zoom";

const Controls = () => {
  return (
    <>
      <div className="absolute right-5 top-5 z-10 flex flex-col gap-2 xl:right-10 xl:top-6">
        <ContextualLayersControls />
        <ZoomControls />
        <MapSettingsControls />
      </div>
      <div className="absolute bottom-10 right-5 z-10 xl:bottom-6 xl:right-10">
        <LegendControls />
      </div>
    </>
  );
};

export default Controls;
