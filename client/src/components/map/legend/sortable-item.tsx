import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";

import LegendItem from "@/components/map/legend/item";
import { cn } from "@/lib/utils";
import { LayerSettings } from "@/types/layer";

interface SortableItemProps {
  id: number;
  settings: LayerSettings;
}

const SortableItem = ({ id, settings }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
    }),
    [transform, transition],
  );

  return (
    <div ref={setNodeRef} style={style} className={cn({ "opacity-0": isDragging })}>
      <LegendItem
        id={id}
        settings={settings}
        sortableAttributes={attributes}
        sortableListeners={listeners}
      />
    </div>
  );
};

export default SortableItem;
