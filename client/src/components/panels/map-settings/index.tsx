import Image from "next/image";

import { BASEMAP_LAYERS, BASEMAPS, LABELS } from "@/components/map/constants";
import { BasemapStyle, LabelsStyle } from "@/components/map/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useMapBasemap from "@/hooks/use-map-basemap";
import useMapBasemapLayers from "@/hooks/use-map-basemap-layers";
import useMapLabels from "@/hooks/use-map-labels";
import GlobeFilledIcon from "@/svgs/globe-filled.svg";

const MapSettingsPanel = () => {
  const [basemap, setBasemap] = useMapBasemap();
  const [labels, setLabels] = useMapLabels();
  const [basemapLayers, setBasemapLayers] = useMapBasemapLayers();

  return (
    <div className="pb-4 pt-1.5">
      <fieldset className="border-b border-b-casper-blue-400 px-4 pb-3">
        <legend className="flex items-center gap-1.5 text-sm leading-[26px]">
          <GlobeFilledIcon className="shrink-0" />
          Map style
        </legend>

        <RadioGroup
          value={basemap}
          onValueChange={(value) => setBasemap(value as BasemapStyle)}
          className="mt-2 flex flex-col gap-2"
        >
          {Object.entries(BASEMAPS).map(([key, { name, image }]) => (
            <div key={key} className="flex items-center gap-1 py-1">
              <RadioGroupItem
                variant="icon"
                size="icon"
                value={key}
                id={`basemap-${key}`}
                className="shrink-0"
              >
                <Image src={image} width={20} height={20} alt="" className="rounded-full" />
              </RadioGroupItem>
              <Label
                htmlFor={`basemap-${key}`}
                className="text-sm peer-hover:font-medium peer-hover:underline peer-focus-visible:font-medium peer-focus-visible:underline"
              >
                {name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </fieldset>

      <fieldset className="mt-2 px-4">
        <legend className="text-xs leading-6">Labels</legend>
        <RadioGroup
          value={labels}
          onValueChange={(value) => setLabels(value as LabelsStyle)}
          className="mt-1 flex items-center gap-6"
        >
          {Object.entries(LABELS).map(([key, { name }]) => (
            <div key={key} className="flex items-center gap-2">
              <RadioGroupItem value={key} id={`labels-${key}`} className="shrink-0" />
              <Label htmlFor={`labels-${key}`} className="text-xs">
                {name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </fieldset>

      {Array.from(new Set(Object.values(BASEMAP_LAYERS).map(({ group }) => group))).map((group) => (
        <fieldset key={group} className="mt-2 px-4">
          <legend className="text-xs leading-6">{group}</legend>
          {Object.entries(BASEMAP_LAYERS)
            .filter(([, layer]) => layer.group === group)
            .map(([key, layer]) => (
              <div key={key} className="flex items-center gap-2 py-0.5">
                <Checkbox
                  value={key}
                  id={`basemap-layer-${key}`}
                  checked={basemapLayers.includes(key as keyof typeof BASEMAP_LAYERS)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setBasemapLayers((layers) => [...layers, key as keyof typeof BASEMAP_LAYERS]);
                    } else {
                      setBasemapLayers((layers) =>
                        layers.filter((layer) => layer !== (key as keyof typeof BASEMAP_LAYERS)),
                      );
                    }
                  }}
                />
                <Label htmlFor={`basemap-layer-${key}`} className="text-xs leading-5">
                  {layer.name}
                </Label>
              </div>
            ))}
        </fieldset>
      ))}
    </div>
  );
};

export default MapSettingsPanel;
