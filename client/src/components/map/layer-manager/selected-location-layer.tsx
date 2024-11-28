import { PathStyleExtension } from "@deck.gl/extensions";
import { GeoJsonLayer } from "@deck.gl/layers";
import { useContext, useEffect, useMemo } from "react";

import useLocation from "@/hooks/use-location";
import { useLocationGeometry } from "@/hooks/use-location-geometry";

import { DeckGLMapboxOverlayContext } from "../deckgl-mapbox-provider";

interface SelectedLocationLayerProps {
  beforeId: string;
}

const SelectedLocationLayer = ({ beforeId }: SelectedLocationLayerProps) => {
  const [location] = useLocation();
  const { data, isLoading } = useLocationGeometry(location.code.slice(-1)[0]);
  const geometry = useMemo(() => {
    if (isLoading || data === undefined || data === null || location.code[0] === "SS") {
      // We return an empty feature collection so that while the geometry is loading, we don't show
      // anything
      return {
        type: "FeatureCollection",
        features: [],
      };
    }

    return data;
  }, [data, isLoading, location.code]);

  const { addLayer, removeLayer } = useContext(DeckGLMapboxOverlayContext);

  useEffect(() => {
    const layers = [
      new GeoJsonLayer({
        id: "selected-location-background-stroke",
        beforeId,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data: geometry,
        stroked: true,
        filled: false,
        getLineColor: [255, 255, 255],
        getLineWidth: 3,
        lineWidthUnits: "pixels",
      }),
      new GeoJsonLayer({
        id: "selected-location-top-stroke",
        beforeId,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data: geometry,
        stroked: true,
        filled: false,
        getLineColor: [255, 204, 21], // supernova-yellow-400
        getLineWidth: 2,
        lineWidthUnits: "pixels",
        getDashArray: [4, 2],
        extensions: [new PathStyleExtension({ dash: true, highPrecisionDash: true })],
      }),
    ];

    layers.forEach((layer) => addLayer(layer));

    return () => {
      layers.forEach((layer) => removeLayer(layer.id));
    };
  }, [addLayer, beforeId, geometry, removeLayer]);

  return null;
};

export default SelectedLocationLayer;
