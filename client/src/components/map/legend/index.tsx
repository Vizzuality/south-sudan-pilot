import { useMemo } from "react";

import useMapLayers from "@/hooks/use-map-layers";

import LegendItem from "./item";

const Legend = () => {
  const [layers] = useMapLayers();

  const legendItems = useMemo(() => {
    return layers.map(({ id, ...settings }) => <LegendItem key={id} id={id} settings={settings} />);
  }, [layers]);

  return legendItems;
};

export default Legend;
