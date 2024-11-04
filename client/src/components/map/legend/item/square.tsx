import { cn } from "@/lib/utils";
import { LegendLegendConfigComponentItemsItem } from "@/types/generated/strapi.schemas";

interface SquareProps {
  item: LegendLegendConfigComponentItemsItem;
  className?: string;
}

const Square = ({ item, className }: SquareProps) => {
  if (item.pattern === "stripes") {
    return (
      <div
        className={className}
        style={{
          background: `repeating-linear-gradient(-45deg, transparent 0px, ${item.color} 0.5px, ${item.color} 1px, transparent 1.5px, transparent 3px)`,
        }}
      />
    );
  }

  return (
    <div
      className={cn(className, {
        "border border-casper-blue-400":
          item.color?.toLowerCase() === "#fff" || item.color?.toLowerCase() === "#ffffff",
      })}
      style={{ background: item.color }}
    />
  );
};

export default Square;
