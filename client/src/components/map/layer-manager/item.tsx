import { Layer, Source } from "react-map-gl";

import useLayerConfig from "@/hooks/use-layer-config";
import { LayerSettings } from "@/types/layer";

interface LayerManagerItemProps {
  id: number;
  beforeId: string;
  settings: LayerSettings;
}

const LayerManagerItem = ({ id, beforeId, settings }: LayerManagerItemProps) => {
  const config = useLayerConfig(id, settings);

  if (!config?.styles) {
    return null;
  }

  return (
    <Source {...config.source}>
      {config.styles.map((style) => (
        <Layer key={style.id} {...style} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default LayerManagerItem;
