import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer } from "@deck.gl/layers";
import { useContext, useEffect } from "react";
import { RasterLayer as IRasterLayer, RasterSource as IRasterSource } from "react-map-gl";

import { LayerConfig } from "@/types/layer";

import { DeckGLMapboxOverlayContext } from "../deckgl-mapbox-provider";

interface RasterLayerProps {
  config: LayerConfig;
  beforeId: string;
}

const RasterLayer = ({ config, beforeId }: RasterLayerProps) => {
  const { addLayer, removeLayer } = useContext(DeckGLMapboxOverlayContext);

  useEffect(() => {
    const style = config.styles[0] as IRasterLayer;
    const source = config.source as IRasterSource;

    const layer = new TileLayer({
      id: style.id,
      beforeId,
      data: source.tiles,
      tileSize: source.tileSize,
      minZoom: source.minzoom,
      maxZoom: source.maxzoom,
      visible: style.layout?.visibility !== "none",
      opacity: style.paint?.["raster-opacity"] as number,
      renderSubLayers: (subLayer) => {
        if (!subLayer || !subLayer.data || !subLayer.tile) {
          return null;
        }

        return new BitmapLayer({
          id: subLayer.id,
          bounds: [
            subLayer.tile.boundingBox[0][0],
            subLayer.tile.boundingBox[0][1],
            subLayer.tile.boundingBox[1][0],
            subLayer.tile.boundingBox[1][1],
          ],
          visible: subLayer.visible,
          opacity: subLayer.opacity,
          textureParameters: {
            minFilter: "nearest",
            magFilter: "nearest",
            mipmapFilter: undefined,
          },
          image: subLayer.data,
        });
      },
    });

    addLayer(layer);

    return () => {
      removeLayer(config.styles[0].id);
    };
  }, [config, beforeId, addLayer, removeLayer]);

  return null;
};

export default RasterLayer;
