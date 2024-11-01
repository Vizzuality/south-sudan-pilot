import useLayerLegend from "@/hooks/use-layer-legend";
import { cn } from "@/lib/utils";

type ValuesProps = ReturnType<typeof useLayerLegend>["data"];

const Values = (data: ValuesProps) => {
  if (!data.items || data.items.length === 0) {
    return null;
  }

  return (
    <div className="mt-1 flex text-2xs text-gray-500">
      {data.items.map((item, index) => (
        <div
          key={item.color}
          title={item.value}
          className={cn({
            "flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap": true,
            "text-left": index === 0,
            "text-center": index > 0 && index + 1 < data.items!.length,
            "text-right": index + 1 === data.items!.length,
          })}
        >
          {item.value}
        </div>
      ))}
    </div>
  );
};

export default Values;
