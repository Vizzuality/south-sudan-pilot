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
    <div className="hidden flex-col gap-px xl:flex">
      <Button type="button" variant="yellow" size="icon" onClick={onClickZoomIn}>
        <span className="sr-only">Zoom in</span>
        <PlusIcon aria-hidden />
      </Button>
      <Button type="button" variant="yellow" size="icon" onClick={onClickZoomOut}>
        <span className="sr-only">Zoom out</span>
        <MinusIcon aria-hidden />
      </Button>
    </div>
  );
};

export default ZoomControls;
