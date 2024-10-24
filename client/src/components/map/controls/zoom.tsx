import { useCallback } from "react";
import { useMap } from "react-map-gl";

import { Button } from "@/components/ui/button";
import MinusIcon from "@/svgs/minus.svg";
import PlusIcon from "@/svgs/plus.svg";

const ZoomControls = () => {
  const { current: map } = useMap();

  const onClickZoomIn = useCallback(() => map?.zoomIn(), [map]);
  const onClickZoomOut = useCallback(() => map?.zoomOut(), [map]);

  return (
    <div className="flex flex-col gap-px">
      <Button
        type="button"
        variant="yellow"
        size="icon"
        className="hidden xl:inline-flex"
        onClick={onClickZoomIn}
      >
        <span className="sr-only">Zoom in</span>
        <PlusIcon aria-hidden />
      </Button>
      <Button
        type="button"
        variant="yellow"
        size="icon"
        className="hidden xl:inline-flex"
        onClick={onClickZoomOut}
      >
        <span className="sr-only">Zoom out</span>
        <MinusIcon aria-hidden />
      </Button>
    </div>
  );
};

export default ZoomControls;
