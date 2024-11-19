import { createContext, PropsWithChildren, useCallback, useMemo, useRef } from "react";

import useDeckGLMapboxOverlay from "@/hooks/use-deckgl-mapbox-overlay";

import type { Layer } from "@deck.gl/core";

interface IDeckGLMapboxOverlayContext {
  addLayer: (layer: Layer) => void;
  removeLayer: (layerId: string) => void;
}

export const DeckGLMapboxOverlayContext = createContext<IDeckGLMapboxOverlayContext>({
  addLayer: () => {
    throw new Error(
      "DeckGLMapboxOverlayContext must be used within <DeckGLMapboxOverlayContext.Provider />.",
    );
  },
  removeLayer: () => {
    throw new Error(
      "DeckGLMapboxOverlayContext must be used within <DeckGLMapboxOverlayContext.Provider />.",
    );
  },
});

const DeckglMapboxProvider = ({ children }: PropsWithChildren) => {
  const layersRef = useRef<Layer[]>([]);
  const deckGLMapboxOverlay = useDeckGLMapboxOverlay();

  const addLayer = useCallback(
    (layer: Layer) => {
      // Artificially delay adding the layer to give a chance to React Map Gl to render the
      // positioning layers first
      setTimeout(() => {
        layersRef.current = [...layersRef.current, layer];
        deckGLMapboxOverlay.setProps({ layers: layersRef.current });
      }, 0);
    },
    [deckGLMapboxOverlay],
  );

  const removeLayer = useCallback(
    (layerId: string) => {
      // Artificially delay removing the layer to match the `addLayer` function
      // Without this, Deck.gl would throw an assertion error
      setTimeout(() => {
        layersRef.current = layersRef.current.filter(({ id }) => id !== layerId);
        deckGLMapboxOverlay.setProps({ layers: layersRef.current });
      }, 0);
    },
    [deckGLMapboxOverlay],
  );

  const value = useMemo(() => ({ addLayer, removeLayer }), [addLayer, removeLayer]);

  return (
    <DeckGLMapboxOverlayContext.Provider value={value}>
      {children}
    </DeckGLMapboxOverlayContext.Provider>
  );
};

export default DeckglMapboxProvider;
