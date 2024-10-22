import { cn } from "@/lib/utils";

import { useSidebar } from "../ui/sidebar";

const Logo = () => {
  const { state } = useSidebar();

  return (
    <div
      className={cn({
        "absolute left-10 top-6 z-20 w-[200px] text-[15px] font-semibold leading-[18px] text-white transition-all duration-500 ease-out":
          true,
        "translate-x-6 text-rhino-blue-950": state === "collapsed",
      })}
    >
      Hydrological Information Management Systems
    </div>
  );
};

export default Logo;
