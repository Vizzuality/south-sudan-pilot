import ChartBarIcon from "@/svgs/chart-bar.svg";
import MapPinIcon from "@/svgs/map-pin.svg";
import MapIcon from "@/svgs/map.svg";

import { Tab } from "./types";

export const TABS: Record<
  Tab,
  { name: string; icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>> }
> = {
  location: {
    name: "Location",
    icon: MapPinIcon,
  },
  main: {
    name: "Analysis",
    icon: ChartBarIcon,
  },
  map: {
    name: "Map",
    icon: MapIcon,
  },
};
