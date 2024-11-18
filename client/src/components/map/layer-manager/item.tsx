import useLayerConfig from "@/hooks/use-layer-config";
import { LayerSettings } from "@/types/layer";

import AnimatedLayer from "./animated-layer";
import RasterLayer from "./raster-layer";
import StaticLayer from "./static-layer";

interface LayerManagerItemProps {
  id: number;
  beforeId: string;
  settings: LayerSettings;
}

const LayerManagerItem = ({ id, beforeId, settings }: LayerManagerItemProps) => {
  const layerConfig = useLayerConfig(id, settings);

  if (!layerConfig) {
    return null;
  }

  const { type, config } = layerConfig;

  if (!config.styles) {
    return null;
  }

  if (type === "animated" && config.source.type === "raster" && !!settings.date) {
    return <AnimatedLayer config={config} date={settings.date} beforeId={beforeId} />;
  }

  if (config.source.type === "raster") {
    return <RasterLayer config={config} beforeId={beforeId} />;
  }

  return <StaticLayer config={config} beforeId={beforeId} />;
};

export default LayerManagerItem;
