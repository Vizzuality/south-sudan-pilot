import { useMemo } from "react";

import useLayerLegend from "@/hooks/use-layer-legend";
import { cn } from "@/lib/utils";
import { LegendLegendConfigComponentItemsItem } from "@/types/generated/strapi.schemas";

type ScaleLegendProps = ReturnType<typeof useLayerLegend>["data"];

const ScaleLegend = (data: ScaleLegendProps) => {
  const itemsByGroup = useMemo(() => {
    if (!data.items || data.items.length === 0) {
      return undefined;
    }

    return data.items.reduce(
      (res, item) => ({
        ...res,
        [item.group ?? ""]: [...(res[item.group ?? ""] ?? []), item].sort(
          (itemA, itemB) => (itemB.size ?? 0) - (itemA.size ?? 0),
        ),
      }),
      {} as Record<string, LegendLegendConfigComponentItemsItem[]>,
    );
  }, [data.items]);

  const minMaxValues = useMemo(() => {
    if (!itemsByGroup) {
      return undefined;
    }

    const minValueItems = Object.values(itemsByGroup).find(
      (items) =>
        items[items.length - 1]?.value !== undefined && items[items.length - 1]?.value !== null,
    );
    const minValue = minValueItems?.[minValueItems?.length - 1].value;

    const maxValue = Object.values(itemsByGroup).find(
      (items) => items[0]?.value !== undefined && items[0]?.value !== null,
    )?.[0].value;

    return [minValue, maxValue] as const;
  }, [itemsByGroup]);

  if (!itemsByGroup) {
    return null;
  }

  return (
    <div className="mb-2 mt-4 flex items-stretch justify-start gap-4">
      {Object.entries(itemsByGroup).map(([key, items], index) => (
        <div key={key} className="relative flex flex-col items-center gap-3.5">
          <div className="text-xs">{key}</div>
          {minMaxValues?.[0] !== undefined && (
            <div
              className={cn({
                "absolute h-0 border-t border-dashed border-t-casper-blue-400": true,
                "left-1/2 w-[calc(50%_+_theme(spacing.4))]": index === 0,
                "left-0 w-[calc(100%_+_theme(spacing.4))]": index > 0,
              })}
              style={{
                bottom: `${items[0]?.size ?? 0}px`,
              }}
            />
          )}
          {minMaxValues?.[1] !== undefined && (
            <div
              className={cn({
                "absolute -bottom-px h-0 border-t border-dashed border-t-casper-blue-400": true,
                "left-1/2 w-[calc(50%_+_theme(spacing.4))]": index === 0,
                "left-0 w-[calc(100%_+_theme(spacing.4))]": index > 0,
              })}
            />
          )}
          <div
            className="relative"
            style={{
              width: `${items[0]?.size ?? 0}px`,
              height: `${items[0]?.size ?? 0}px`,
            }}
          >
            {items.map((item) => (
              <div
                key={item.size ?? 0}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full border border-white"
                style={{
                  width: `${item.size ?? 0}px`,
                  height: `${item.size ?? 0}px`,
                  backgroundColor: item.color,
                }}
              />
            ))}
          </div>
        </div>
      ))}
      {!!minMaxValues && (
        <div
          className={cn({
            "flex flex-col": true,
            "pt-5": !("" in itemsByGroup),
            "pt-1": "" in itemsByGroup,
          })}
        >
          {minMaxValues[0] !== undefined && (
            <div className="relative left-1 text-xs">
              <span className="relative top-px">{minMaxValues[1]}</span>
            </div>
          )}
          {minMaxValues[1] !== undefined && (
            <div className="relative left-1 top-1.5 mt-auto text-xs">
              <span className="relative top-px">{minMaxValues[0]}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScaleLegend;
