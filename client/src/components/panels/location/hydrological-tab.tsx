import { useCallback, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxLoading,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import useLocationsByType from "@/hooks/use-locations-by-type";
import XMarkIcon from "@/svgs/xmark.svg";

interface HydrologicalTabProps {
  locationCode: string[];
  onChangeLocationCode: (locationCode: string[]) => void;
}

const HydrologicalTab = ({ locationCode, onChangeLocationCode }: HydrologicalTabProps) => {
  const { data, isLoading } = useLocationsByType("hydrological");

  const selectedLocation = useMemo(() => {
    if (locationCode.length === 0 || isLoading) {
      return undefined;
    }

    return data.find(({ code }) => code === locationCode[0]);
  }, [isLoading, data, locationCode]);

  const onChangeLocation = useCallback(
    (code: string | undefined) => {
      onChangeLocationCode(code ? [code] : []);
    },
    [onChangeLocationCode],
  );

  return (
    <>
      <p>
        Choose a hydrological basin to explore data organized by natural water catchment areas. This
        option supports water resource analysis based on basin-level dynamics and trends.
      </p>
      <div className="mt-8 flex flex-col gap-4">
        <Combobox value={locationCode[0] ?? ""} onValueChange={onChangeLocation}>
          <div className="relative">
            <ComboboxTrigger>
              {!!selectedLocation && <span className="font-semibold">{selectedLocation.name}</span>}
              {!selectedLocation && "Select river basin"}
            </ComboboxTrigger>
            {!!selectedLocation && (
              <Button
                type="button"
                variant="ghost"
                size="auto"
                className="absolute right-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-casper-blue-400 text-rhino-blue-950 focus-visible:ring-casper-blue-950"
                onClick={() => onChangeLocation(undefined)}
              >
                <span className="sr-only">Clear river basin</span>
                <XMarkIcon aria-hidden />
              </Button>
            )}
          </div>
          <ComboboxContent>
            <ComboboxInput placeholder="Search river basin" />
            <ComboboxList>
              <ComboboxEmpty>No results found.</ComboboxEmpty>
              {isLoading && <ComboboxLoading>Loading...</ComboboxLoading>}
              {!isLoading &&
                data.map(({ code, name }) => (
                  <ComboboxItem key={code} value={code} keywords={[name]}>
                    {name}
                  </ComboboxItem>
                ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </>
  );
};

export default HydrologicalTab;
