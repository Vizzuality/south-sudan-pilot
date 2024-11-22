"use client";

import { useCallback, useState } from "react";

import Intro from "@/components/intro";
import LocationPanel from "@/components/panels/location";
import MainPanel from "@/components/panels/main";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";
import useLocation from "@/hooks/use-location";
import { useLocationByCodes } from "@/hooks/use-location-by-codes";
import MapPinIcon from "@/svgs/map-pin.svg";

import Logo from "../logo";

const NavigationDesktop = () => {
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);

  const [location] = useLocation();
  const { data, isLoading } = useLocationByCodes([...location.code].reverse());

  const onExitLocationDialog = useCallback(() => {
    setLocationDialogOpen(false);
  }, []);

  return (
    <>
      <Logo />
      <Sidebar>
        <SidebarHeader className="h-[88px] bg-rhino-blue-900 px-10 py-6 text-white">
          <SidebarTrigger className="absolute right-0 top-6 z-10 translate-x-1/2 transition-transform group-data-[state=collapsed]:translate-x-full [&_svg]:rotate-90 group-data-[state=collapsed]:[&_svg]:-rotate-90" />
        </SidebarHeader>
        <SidebarContent className="overflow-auto">
          <div className="bg-rhino-blue-900 px-10 pb-5 text-white">
            <Intro />
            <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="relative -left-4 mt-2 gap-4 text-white/60 hover:text-white focus-visible:text-white"
                >
                  {(isLoading || !data) && "Select location"}
                  {!isLoading && !!data && data.map(({ name }) => name).join(", ")}
                  <MapPinIcon aria-hidden />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <LocationPanel onExit={onExitLocationDialog} />
              </DialogContent>
            </Dialog>
          </div>
          <MainPanel />
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default NavigationDesktop;
