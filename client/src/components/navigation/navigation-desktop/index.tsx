"use client";

import Intro from "@/components/intro";
import MainPanel from "@/components/panels/main";
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";

import Logo from "../logo";

const NavigationDesktop = () => {
  return (
    <>
      <Logo />
      <Sidebar>
        <SidebarHeader className="h-[88px] bg-rhino-blue-900 px-10 py-6 text-white">
          <SidebarTrigger className="absolute right-0 top-6 z-10 translate-x-1/2 transition-transform group-data-[state=collapsed]:translate-x-full [&_svg]:rotate-90 group-data-[state=collapsed]:[&_svg]:-rotate-90" />
        </SidebarHeader>
        <SidebarContent className="overflow-auto">
          <div className="bg-rhino-blue-900 px-10 pb-6 text-white">
            <Intro />
          </div>
          <MainPanel />
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default NavigationDesktop;
