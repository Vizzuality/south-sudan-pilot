"use client";

import {
  Announcements,
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  ScreenReaderInstructions,
} from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useCallback, useMemo, useState } from "react";

import SortableItem from "@/components/map/legend/sortable-item";
import useMapLayers from "@/hooks/use-map-layers";

import LegendItem from "./item";

const Legend = () => {
  const [layers, { updateLayerOrder }] = useMapLayers();
  const [draggedLayerId, setDraggedLayerId] = useState<number | null>(null);

  const legendItems = useMemo(() => {
    return layers.map(({ id, ...settings }) => (
      <SortableItem key={id} id={id} settings={settings} />
    ));
  }, [layers]);

  const draggedLegendItem = useMemo(() => {
    if (draggedLayerId === null) {
      return null;
    }

    const layer = layers.find(({ id }) => id === draggedLayerId);
    if (!layer) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...settings } = layer;

    return (
      <div className="shadow">
        <LegendItem id={draggedLayerId} settings={settings} />
      </div>
    );
  }, [layers, draggedLayerId]);

  const layerIds = useMemo(() => layers.map(({ id }) => id), [layers]);

  const accessibility: {
    announcements: Announcements;
    screenReaderInstructions: ScreenReaderInstructions;
  } = useMemo(
    () => ({
      announcements: {
        onDragStart({ active }) {
          const position = layers.findIndex(({ id }) => id === active.id);
          return `Picked up layer in position ${position} of ${layers.length}`;
        },
        onDragOver({ over }) {
          if (over) {
            const position = layers.findIndex(({ id }) => id === over.id);
            return `Layer was moved into position ${position} of ${layers.length}`;
          }
        },
        onDragEnd({ over }) {
          if (over) {
            const position = layers.findIndex(({ id }) => id === over.id);
            return `Layer was dropped at position ${position} of ${layers.length}`;
          }
        },
        onDragCancel() {
          return `Dragging was cancelled.`;
        },
      },
      screenReaderInstructions: {
        draggable:
          "Press space or enter to grab the layer. Use the arrow keys to move the layer up or down. Press space or enter again to drop the layer. Press escape to cancel.",
      },
    }),
    [layers],
  );

  const onDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      setDraggedLayerId(active.id as number);
    },
    [setDraggedLayerId],
  );

  const onDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (over === null || active.id === over.id) {
        return;
      }

      const id = active.id as number;
      const index = layerIds.indexOf(over.id as number);

      updateLayerOrder(id, index);
      setDraggedLayerId(null);
    },
    [layerIds, updateLayerOrder, setDraggedLayerId],
  );

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      accessibility={accessibility}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <SortableContext strategy={verticalListSortingStrategy} items={layerIds}>
        {legendItems}
      </SortableContext>
      <DragOverlay>{draggedLegendItem}</DragOverlay>
    </DndContext>
  );
};

export default Legend;
