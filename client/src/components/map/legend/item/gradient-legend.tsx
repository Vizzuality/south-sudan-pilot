import BasicLegend from "@/components/map/legend/item/basic-legend";
import Unit from "@/components/map/legend/item/unit";
import Values from "@/components/map/legend/item/values";
import useLayerLegend from "@/hooks/use-layer-legend";

type GradientLegendProps = ReturnType<typeof useLayerLegend>["data"];

const GradientLegend = (data: GradientLegendProps) => {
  if (!data.items || data.items.length === 0) {
    return null;
  }

  if (data.items.length === 1) {
    return <BasicLegend {...data} />;
  }

  return (
    <>
      <Unit {...data} />
      <div
        className="h-3"
        style={{
          background: `linear-gradient(to right, ${data.items.map((item) => item.color).join(", ")})`,
        }}
      />
      <Values {...data} />
    </>
  );
};

export default GradientLegend;
