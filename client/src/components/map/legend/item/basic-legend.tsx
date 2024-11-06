import Square from "@/components/map/legend/item/square";
import useLayerLegend from "@/hooks/use-layer-legend";

type BasicLegendProps = ReturnType<typeof useLayerLegend>["data"];

const BasicLegend = (data: BasicLegendProps) => {
  if (!data.items || data.items.length === 0) {
    return null;
  }

  if (data.items.length === 1) {
    const item = data.items[0];

    if (item.value !== null) {
      return (
        <div className="flex items-start gap-2">
          <Square item={item} className="relative top-0.5 h-3 w-5 shrink-0" />
          <div className="text-2xs text-gray-500">{item.value}</div>
        </div>
      );
    } else {
      return <Square item={item} className="h-3" />;
    }
  }

  return (
    <div className="columns-2">
      {data.items.map((item) => (
        <div key={item.color} className="flex items-start gap-2">
          <Square item={item} className="relative top-0.5 h-3 w-5 shrink-0" />
          <div className="text-2xs text-gray-500">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export default BasicLegend;
