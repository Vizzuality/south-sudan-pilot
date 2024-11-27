import { GeoJsonProperties } from "geojson";
import { useMemo } from "react";

interface ChartSentenceprops {
  sentence: string;
  feature?: GeoJsonProperties;
}

const ChartSentence = ({ sentence, feature }: ChartSentenceprops) => {
  const resolvedSentence = useMemo(() => {
    let res = `${sentence}`; // Creating a copy

    if (!!feature) {
      Object.entries(feature).forEach(([key, value]) => {
        res = res.replace(`{${key}}`, value);
      });
    }

    return res;
  }, [sentence, feature]);

  return (
    <div className="flex items-start justify-start gap-4 pl-8 text-xs">
      {!!feature && <div className="shrink-0 font-medium">Selected point</div>}
      <div>{resolvedSentence}</div>
    </div>
  );
};

export default ChartSentence;
