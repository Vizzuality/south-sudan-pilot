import Image from "next/image";

import { BASEMAPS, LABELS } from "@/components/map/constants";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import GlobeFilledIcon from "@/svgs/globe-filled.svg";

const MapSettingsPanel = () => {
  return (
    <div className="pb-4 pt-1.5">
      <fieldset className="border-b border-b-casper-blue-400 px-4 pb-3">
        <legend className="flex items-center gap-1.5 text-sm leading-[26px]">
          <GlobeFilledIcon className="shrink-0" />
          Map style
        </legend>
        <RadioGroup className="mt-2 flex flex-col gap-2">
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
        <RadioGroup className="mt-1 flex items-center gap-6">
          {Object.entries(LABELS).map(([key, { name }]) => (
            <div key={key} className="flex items-center gap-2">
              <RadioGroupItem value={key} id={`labels-${key}`} className="shrink-0" />
              <Label htmlFor={`labels-${key}`} className="text-xs">
                {name}
              </Label>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <RadioGroupItem value="" id="labels-no" className="shrink-0" />
            <Label htmlFor="labels-no" className="text-xs">
              No labels
            </Label>
          </div>
        </RadioGroup>
      </fieldset>
    </div>
  );
};

export default MapSettingsPanel;
