import Square from "@/components/map/legend/item/square";
import Unit from "@/components/map/legend/item/unit";
import Values from "@/components/map/legend/item/values";
import useLayerLegend from "@/hooks/use-layer-legend";

type ChoroplethLegendProps = ReturnType<typeof useLayerLegend>["data"];

const ChoroplethLegend = (data: ChoroplethLegendProps) => {
  if (!data.items || data.items.length === 0) {
    return null;
  }

  return (
    <>
      <Unit {...data} />
      <div className="flex h-3">
        {data.items.map((item) => (
          <Square key={item.color} item={item} className="flex-1" />
        ))}
      </div>
      <Values {...data} />
    </>
  );
};

export default ChoroplethLegend;
