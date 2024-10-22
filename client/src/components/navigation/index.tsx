"use client";

import { Media, MediaContextProvider } from "@/media";

import NavigationDesktop from "./navigation-desktop";
import NavigationMobile from "./navigation-mobile";

const Navigation = () => {
  return (
    <MediaContextProvider>
      <Media lessThan="xl">
        <NavigationMobile />
      </Media>
      <Media greaterThanOrEqual="xl" className="absolute">
        <NavigationDesktop />
      </Media>
    </MediaContextProvider>
  );
};

export default Navigation;
