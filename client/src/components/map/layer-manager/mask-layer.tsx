import { GeoJsonLayer } from "@deck.gl/layers";
import { useContext, useEffect, useMemo } from "react";

import useLocation from "@/hooks/use-location";
import { useLocationGeometry } from "@/hooks/use-location-geometry";

import { DeckGLMapboxOverlayContext } from "../deckgl-mapbox-provider";

interface MaskLayerProps {
  beforeId: string;
}

const MaskLayer = ({ beforeId }: MaskLayerProps) => {
  const [location] = useLocation();
  const { data, isLoading } = useLocationGeometry(location.code.slice(-1)[0]);
  const geometry = useMemo(() => {
    if (isLoading || data === undefined || data === null) {
      // We return an empty feature collection so that while the geometry is loading, we don't show
      // anything instead of the layers unmasked
      return {
        type: "FeatureCollection",
        features: [],
      };
    }

    return data;
  }, [data, isLoading]);

  const { addLayer, removeLayer } = useContext(DeckGLMapboxOverlayContext);

  useEffect(() => {
    const layer = new GeoJsonLayer({
      id: "mask",
      beforeId,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      data: geometry,
      stroked: false,
      operation: "mask",
    });

    addLayer(layer);

    return () => {
      removeLayer("mask");
    };
  }, [addLayer, beforeId, geometry, removeLayer]);

  return null;
};

export default MaskLayer;
