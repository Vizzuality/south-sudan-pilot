import useLayerLegend from "@/hooks/use-layer-legend";

type UnitProps = ReturnType<typeof useLayerLegend>["data"];

const Unit = (data: UnitProps) => {
  if (!data.unit) {
    return null;
  }

  return <div className="mb-1 flex justify-end text-2xs text-gray-500">({data.unit})</div>;
};

export default Unit;
