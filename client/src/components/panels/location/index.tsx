import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useLocation from "@/hooks/use-location";
import MapPinIcon from "@/svgs/map-pin.svg";

import AdministrativeTab from "./administrative-tab";
import HydrologicalTab from "./hydrological-tab";

interface LocationPanelProps {
  onExit: () => void;
}

const LocationPanel = ({ onExit }: LocationPanelProps) => {
  const [location, setLocation] = useLocation();

  // We're copying `location` in the local state so that we only update the URL when the user closes
  // the modal
  const [tab, setTab] = useState(location.type);
  const [code, setCode] = useState(location.code);

  const onChangeTab = useCallback(
    (tab: string) => {
      setTab(tab as typeof location.type);
      setCode([]);
    },
    [location],
  );

  const onClear = useCallback(() => {
    setLocation(null);
    onExit();
  }, [setLocation, onExit]);

  const onSelect = useCallback(() => {
    setLocation({
      // If no location is selected, then we keep the administrative tab as default
      type: code.length === 0 ? "administrative" : tab,
      code,
    });
    onExit();
  }, [setLocation, tab, code, onExit]);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex gap-4">
          Select location
          <MapPinIcon aria-hidden />
        </DialogTitle>
      </DialogHeader>
      <Tabs className="mt-8 xl:mt-12" value={tab} onValueChange={onChangeTab}>
        <TabsList>
          <TabsTrigger value="administrative">Administrative boundaries</TabsTrigger>
          <TabsTrigger value="hydrological">Hydrological basins</TabsTrigger>
        </TabsList>
        <TabsContent value="administrative" className="text-xs xl:text-sm">
          <AdministrativeTab locationCode={code} onChangeLocationCode={setCode} />
        </TabsContent>
        <TabsContent value="hydrological" className="text-xs xl:text-sm">
          <HydrologicalTab locationCode={code} onChangeLocationCode={setCode} />
        </TabsContent>
      </Tabs>
      <DialogFooter className="mt-10 xl:mt-16">
        <Button type="button" variant="default-outline" className="px-6" onClick={onClear}>
          Clear
        </Button>
        <Button
          type="button"
          variant="default"
          className="px-6"
          onClick={onSelect}
          disabled={code.length === 0}
        >
          Select
        </Button>
      </DialogFooter>
    </>
  );
};

export default LocationPanel;
