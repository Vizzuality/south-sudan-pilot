import { useMemo } from "react";
import { Layer } from "react-map-gl";

import MaskLayer from "@/components/map/layer-manager/mask-layer";
import useMapLayers from "@/hooks/use-map-layers";

import LayerManagerItem from "./item";

const LayerManager = () => {
  const [layers] = useMapLayers();

  /**
   * These layers are here to aid with positioning the real data layers between themselves.
   * See more: https://github.com/visgl/react-map-gl/issues/939#issuecomment-625290200
   */
  const positioningLayers = useMemo(() => {
    return [
      ...layers.map((layer, index) => {
        const beforeId = index === 0 ? "data-layers" : `layer-position-${layers[index - 1].id}`;
        return (
          <Layer
            key={`layer-position-${layer.id}`}
            id={`layer-position-${layer.id}`}
            type="background"
            layout={{ visibility: "none" }}
            beforeId={beforeId}
          />
        );
      }),
      <Layer
        key="layer-position-mask"
        id="layer-position-mask"
        type="background"
        layout={{ visibility: "none" }}
        beforeId={`layer-position-${layers.length === 0 ? "data-layers" : layers.slice(-1)[0].id}`}
      />,
    ];
  }, [layers]);

  const layerManagerItems = useMemo(() => {
    return [
      ...layers.map((layer, index) => {
        const beforeId = index === 0 ? "data-layers" : `layer-position-${layers[index - 1].id}`;
        const { id, ...settings } = layer;
        return (
          <LayerManagerItem key={`layer-${id}`} id={id} settings={settings} beforeId={beforeId} />
        );
      }),
      <MaskLayer
        key="layer-mask"
        beforeId={layers.length === 0 ? "data-layers" : `layer-position-${layers.slice(-1)[0].id}`}
      />,
    ];
  }, [layers]);

  return (
    <>
      {positioningLayers}
      {layerManagerItems}
    </>
  );
};

export default LayerManager;
