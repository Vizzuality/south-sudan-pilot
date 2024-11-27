import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import GraphIcon from "@/svgs/graph.svg";

interface DownloadChartButtonProps {
  data: unknown;
  fileName: string;
  disabled: boolean;
}

const DownloadChartButton = ({ data, fileName, disabled }: DownloadChartButtonProps) => {
  const onClickSaveChartData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });

    const link = document.createElement("a");
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    link.click();
    link.remove();
  }, [data, fileName]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="group/chart"
            disabled={disabled}
            onClick={onClickSaveChartData}
          >
            <span className="sr-only">Save chart data</span>
            <GraphIcon
              className="!size-4 transition-colors group-hover/chart:text-casper-blue-300"
              aria-hidden
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Save chart data</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DownloadChartButton;
