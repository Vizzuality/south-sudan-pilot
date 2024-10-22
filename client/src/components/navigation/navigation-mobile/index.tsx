"use client";

import { useState } from "react";

import Intro from "@/components/intro";
import LocationPanel from "@/components/panels/location";
import MainPanel from "@/components/panels/main";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetOverlay, SheetTitle } from "@/components/ui/sheet";

import { TABS } from "./constants";
import { Tab } from "./types";

const NavigationMobile = () => {
  const [tab, setTab] = useState<Tab>(Tab.Main);

  return (
    <>
      <Sheet modal={false} open={tab === Tab.Main || tab === Tab.Location}>
        <SheetOverlay className="!bottom-[68px]" />
        <SheetContent side="bottom" className="bottom-[68px] h-[calc(100%_-_68px)]">
          <SheetHeader className="text-center">
            <SheetTitle className="sr-only">{TABS[tab].name}</SheetTitle>
            <Intro showDescription={tab === Tab.Main} />
          </SheetHeader>
          <div className="mt-6">
            {tab === Tab.Main && <MainPanel />}
            {tab === Tab.Location && <LocationPanel />}
          </div>
        </SheetContent>
      </Sheet>
      <div
        role="menubar"
        className="relative z-20 flex items-center justify-center bg-rhino-blue-900 px-5 py-2.5 text-white"
      >
        {Object.entries(TABS).map(([key, { name, icon: Icon }]) => (
          <Button
            key={key}
            variant="ghost"
            size="auto"
            type="button"
            role="menuitemradio"
            aria-checked={key === tab}
            className="w-16 flex-col items-center aria-checked:text-supernova-yellow-400"
            onClick={() => setTab(key as Tab)}
          >
            <Icon className="shrink-0" aria-hidden />
            <span className="text-xs">{name}</span>
          </Button>
        ))}
      </div>
    </>
  );
};

export default NavigationMobile;
