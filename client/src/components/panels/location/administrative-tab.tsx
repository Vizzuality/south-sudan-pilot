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

interface AdministrativeTabProps {
  locationCode: string[];
  onChangeLocationCode: (locationCode: string[]) => void;
}

const AdministrativeTab = ({ locationCode, onChangeLocationCode }: AdministrativeTabProps) => {
  const { data: dataLevel1, isLoading: isLoadingLevel1 } = useLocationsByType("administrative", 1);
  const { data: dataLevel2, isLoading: isLoadingLevel2 } = useLocationsByType(
    "administrative",
    2,
    locationCode[0],
    locationCode.length > 0 && locationCode[0] !== "SS",
  );
  const { data: dataLevel3, isLoading: isLoadingLevel3 } = useLocationsByType(
    "administrative",
    3,
    locationCode?.[1],
    locationCode.length > 1,
  );

  const selectedLocationLevel1 = useMemo(() => {
    if (locationCode.length === 0 || isLoadingLevel1) {
      return undefined;
    }

    return dataLevel1.find(({ code }) => code === locationCode[0]);
  }, [isLoadingLevel1, dataLevel1, locationCode]);

  const selectedLocationLevel2 = useMemo(() => {
    if (locationCode.length < 2 || isLoadingLevel2) {
      return undefined;
    }

    return dataLevel2.find(({ code }) => code === locationCode[1]);
  }, [isLoadingLevel2, dataLevel2, locationCode]);

  const selectedLocationLevel3 = useMemo(() => {
    if (locationCode.length < 3 || isLoadingLevel3) {
      return undefined;
    }

    return dataLevel3.find(({ code }) => code === locationCode[2]);
  }, [isLoadingLevel3, dataLevel3, locationCode]);

  const onChangeLocationLevel1 = useCallback(
    (code: string | undefined) => {
      onChangeLocationCode(code ? [code] : []);
    },
    [onChangeLocationCode],
  );

  const onChangeLocationLevel2 = useCallback(
    (code: string | undefined) => {
      onChangeLocationCode(code ? [locationCode[0], code] : [locationCode[0]]);
    },
    [locationCode, onChangeLocationCode],
  );

  const onChangeLocationLevel3 = useCallback(
    (code: string | undefined) => {
      onChangeLocationCode(
        code ? [locationCode[0], locationCode[1], code] : [locationCode[0], locationCode[1]],
      );
    },
    [locationCode, onChangeLocationCode],
  );

  return (
    <>
      <p>
        Select a location by administrative boundaries to view data specific to states, counties, or
        payams. This helps focus on localized insights for effective resource management and
        planning.
      </p>
      <div className="mt-8 flex flex-col gap-4">
        <Combobox value={locationCode[0] ?? ""} onValueChange={onChangeLocationLevel1}>
          <div className="relative">
            <ComboboxTrigger>
              {!!selectedLocationLevel1 && (
                <span className="font-semibold">{selectedLocationLevel1.name}</span>
              )}
              {!selectedLocationLevel1 && "Select state"}
            </ComboboxTrigger>
            {!!selectedLocationLevel1 && (
              <Button
                type="button"
                variant="ghost"
                size="auto"
                className="absolute right-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-casper-blue-400 text-rhino-blue-950 focus-visible:ring-casper-blue-950"
                onClick={() => onChangeLocationLevel1(undefined)}
              >
                <span className="sr-only">Clear state</span>
                <XMarkIcon aria-hidden />
              </Button>
            )}
          </div>
          <ComboboxContent>
            <ComboboxInput placeholder="Search state" />
            <ComboboxList>
              <ComboboxEmpty>No results found.</ComboboxEmpty>
              {isLoadingLevel1 && <ComboboxLoading>Loading...</ComboboxLoading>}
              {!isLoadingLevel1 &&
                dataLevel1.map(({ code, name }) => (
                  <ComboboxItem key={code} value={code} keywords={[name]}>
                    {name}
                  </ComboboxItem>
                ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <Combobox value={locationCode?.[1] ?? ""} onValueChange={onChangeLocationLevel2}>
          <div className="relative">
            <ComboboxTrigger disabled={locationCode.length < 1 || locationCode[0] === "SS"}>
              {!!selectedLocationLevel2 && (
                <span className="font-semibold">{selectedLocationLevel2.name}</span>
              )}
              {!selectedLocationLevel2 && "Select county"}
            </ComboboxTrigger>
            {!!selectedLocationLevel2 && (
              <Button
                type="button"
                variant="ghost"
                size="auto"
                className="absolute right-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-casper-blue-400 text-rhino-blue-950 focus-visible:ring-casper-blue-950"
                onClick={() => onChangeLocationLevel2(undefined)}
              >
                <span className="sr-only">Clear county</span>
                <XMarkIcon aria-hidden />
              </Button>
            )}
          </div>
          <ComboboxContent>
            <ComboboxInput placeholder="Search county" />
            <ComboboxList>
              <ComboboxEmpty>No results found.</ComboboxEmpty>
              {isLoadingLevel2 && <ComboboxLoading>Loading...</ComboboxLoading>}
              {!isLoadingLevel2 &&
                dataLevel2.map(({ code, name }) => (
                  <ComboboxItem key={code} value={code} keywords={[name]}>
                    {name}
                  </ComboboxItem>
                ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <Combobox value={locationCode?.[2] ?? ""} onValueChange={onChangeLocationLevel3}>
          <div className="relative">
            <ComboboxTrigger disabled={locationCode.length < 2}>
              {!!selectedLocationLevel3 && (
                <span className="font-semibold">{selectedLocationLevel3.name}</span>
              )}
              {!selectedLocationLevel3 && "Select payam"}
            </ComboboxTrigger>
            {!!selectedLocationLevel3 && (
              <Button
                type="button"
                variant="ghost"
                size="auto"
                className="absolute right-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-casper-blue-400 text-rhino-blue-950 focus-visible:ring-casper-blue-950"
                onClick={() => onChangeLocationLevel3(undefined)}
              >
                <span className="sr-only">Clear payam</span>
                <XMarkIcon aria-hidden />
              </Button>
            )}
          </div>
          <ComboboxContent>
            <ComboboxInput placeholder="Search payam" />
            <ComboboxList>
              <ComboboxEmpty>No results found.</ComboboxEmpty>
              {isLoadingLevel3 && <ComboboxLoading>Loading...</ComboboxLoading>}
              {!isLoadingLevel3 &&
                dataLevel3.map(({ code, name }) => (
                  <ComboboxItem key={code} value={code} keywords={[name]}>
                    {name}
                  </ComboboxItem>
                ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>{" "}
      </div>
    </>
  );
};

export default AdministrativeTab;
