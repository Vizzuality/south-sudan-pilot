import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer } from "@deck.gl/layers";
import { GL } from "@luma.gl/constants";
import parseAPNG from "apng-js";
import { getMonth } from "date-fns";
import { useContext, useEffect } from "react";
import { RasterLayer, RasterSource } from "react-map-gl";

import { LayerConfig } from "@/types/layer";

import { DeckGLMapboxOverlayContext } from "../deckgl-mapbox-provider";

interface AnimatedLayerProps {
  config: LayerConfig;
  date: string;
  beforeId: string;
}

const AnimatedLayer = ({ config, date, beforeId }: AnimatedLayerProps) => {
  const { addLayer, removeLayer } = useContext(DeckGLMapboxOverlayContext);

  useEffect(() => {
    const style = config.styles[0] as RasterLayer;
    const source = config.source as RasterSource;
    const frameIndex = getMonth(date);

    const layer = new TileLayer({
      id: style.id,
      beforeId,
      frameIndex,
      data: source.tiles,
      tileSize: source.tileSize,
      minZoom: source.minzoom,
      maxZoom: source.maxzoom,
      visible: style.layout?.visibility !== "none",
      opacity: style.paint?.["raster-opacity"] as number,
      getTileData: ({ url, index: { x, y, z }, signal }) => {
        const resolvedUrl = url!
          .replace("{x}", `${x}`)
          .replace("{y}", `${y}`)
          .replace("{z}", `${z}`);

        const response = fetch(resolvedUrl, { signal });

        if (signal?.aborted) {
          return null;
        }

        return response
          .then((res) => res.arrayBuffer())
          .then((buffer) => {
            const apng = parseAPNG(buffer);

            if (apng instanceof Error) {
              return null;
            }

            return apng.frames.map((frame) => {
              return {
                ...frame,
                bitmapData: createImageBitmap(frame.imageData as Blob),
              };
            });
          });
      },
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
            [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
            [GL.TEXTURE_MAG_FILTER]: GL.NEAREST,
            [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
            [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE,
          },
          image: subLayer.data[frameIndex].bitmapData,
        });
      },
    });

    addLayer(layer);

    return () => {
      removeLayer(config.styles[0].id);
    };
  }, [config, date, beforeId, addLayer, removeLayer]);

  return null;
};

export default AnimatedLayer;
