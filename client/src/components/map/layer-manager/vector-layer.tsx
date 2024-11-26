import { GetPickingInfoParams } from "@deck.gl/core";
import { MaskExtension } from "@deck.gl/extensions";
import { MVTLayer, MVTLayerPickingInfo, MVTLayerProps } from "@deck.gl/geo-layers";
import { ScatterplotLayer } from "@deck.gl/layers";
import { BinaryFeatureCollection } from "@loaders.gl/schema";
import { useContext, useEffect } from "react";
import { VectorSourceRaw as IVectorTileSource } from "react-map-gl";

import { env } from "@/env";
import useMapZoom from "@/hooks/use-map-zoom";
import { LayerConfig, LayerInteractionState } from "@/types/layer";
import { convertBinaryToPointGeoJSON, resolveDeckglProperties } from "@/utils/mapbox-deckgl-bridge";

import { DeckGLMapboxOverlayContext } from "../deckgl-mapbox-provider";

interface VectorLayerProps {
  config: LayerConfig;
  beforeId: string;
  interactive: boolean;
  onHover: (properties: LayerInteractionState["hoveredFeature"]) => void;
  onClick: (properties: LayerInteractionState["selectedFeature"]) => void;
}

const VectorLayer = ({ config, beforeId, interactive, onHover, onClick }: VectorLayerProps) => {
  const { addLayer, removeLayer } = useContext(DeckGLMapboxOverlayContext);
  const zoom = useMapZoom();

  useEffect(() => {
    const source = config.source as IVectorTileSource;
    const styles = config.styles;

    const layers: MVTLayer[] = [];

    styles.map((style, index) => {
      if (!source.url) {
        return null;
      }

      const layerProps: MVTLayerProps & {
        data: string;
        beforeId: string;
        maskId: string;
        zoom: number;
      } = {
        // Adding the index just to make sure the ids were not copied and pasted in the layer
        // definition
        id: `${style.id}-${index}`,
        beforeId,
        data: `https://api.mapbox.com/v4/${source.url.split("//")[1]}/{z}/{x}/{y}.vector.pbf?access_token=${env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
        // It's important to pass `zoom` as a parameter so that the layer is immediately re-rendered
        // when the zoom value is changed
        zoom,
        minZoom: source.minzoom,
        maxZoom: source.maxzoom,
        ...resolveDeckglProperties(style, zoom),
        extensions: [new MaskExtension()],
        maskId: "mask",
        pickable: interactive,
        onHover: ({ picked, object }) => {
          if (picked) {
            onHover(object.properties);
          } else {
            onHover(null);
          }
        },
        onClick: ({ picked, object }) => {
          if (picked) {
            onClick(object.properties);
          } else {
            onClick(null);
          }
        },
      };

      // Here's an edge case: when the vector layer contains polygons and lines, Mapbox allows
      // anyway to render circles for each of the vertices. By default, Deck.gl will only render
      // circles if the underlying feature is of type Point.
      // The code below reproduces Mapbox' behaviour by forcing rendering circles for any type of
      // geometry.
      if (style.type === "circle") {
        layerProps.renderSubLayers = ({ id, data, ...rest }) => {
          if (data === null) {
            return null;
          }

          return new ScatterplotLayer({
            id: `${id}-circle`,
            // The MVT data is encoded to binary. It is decoded below to simplify the code though
            // it comes with a performance penalty.
            data: convertBinaryToPointGeoJSON(data as BinaryFeatureCollection).features,
            getPosition: (d) => d.geometry.coordinates,
            getRadius: layerProps.getPointRadius,
            radiusUnits: layerProps.pointRadiusUnits,
            ...rest,
          });
        };
      }

      // We extend the MVTLayer class to make sure that when interacting with the layer, we pick
      // the correct feature information, which is decoded binary data (i.e. GeoJSON properties) for
      // the circle layers
      class MVTJSONLayer extends MVTLayer {
        getPickingInfo(params: GetPickingInfoParams) {
          if (style.type === "circle") {
            return params.info as MVTLayerPickingInfo<unknown>;
          }

          return super.getPickingInfo(params);
        }
      }

      layers.push(new MVTJSONLayer(layerProps));
    });

    layers.map((layer) => {
      addLayer(layer);
    });

    return () => {
      layers.map((layer) => {
        removeLayer(layer.id);
      });
    };
  }, [config, beforeId, addLayer, removeLayer, zoom, interactive, onHover, onClick]);

  return null;
};

export default VectorLayer;
