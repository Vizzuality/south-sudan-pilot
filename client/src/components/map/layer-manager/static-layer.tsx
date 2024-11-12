import { Layer, Source } from "react-map-gl";

import { LayerConfig } from "@/types/layer";

interface StaticLayerProps {
  config: LayerConfig;
  beforeId: string;
}

const StaticLayer = ({ config, beforeId }: StaticLayerProps) => {
  return (
    <Source
      // The key ensures that if the URL of the source changes, Mapbox will correctly detect the
      // change
      key={config.source.url}
      {...config.source}
    >
      {config.styles.map((style) => (
        <Layer key={style.id} {...style} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default StaticLayer;
