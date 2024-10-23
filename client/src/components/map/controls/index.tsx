import MapSettingsControls from "./map-settings";
import ZoomControls from "./zoom";

const Controls = () => {
  return (
    <div className="absolute bottom-10 right-5 z-10 flex flex-col gap-2 xl:bottom-6 xl:right-10">
      <ZoomControls />
      <MapSettingsControls />
    </div>
  );
};

export default Controls;
