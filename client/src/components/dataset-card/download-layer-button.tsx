import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import DownloadIcon from "@/svgs/download.svg";

interface DownloadLayerButtonProps {
  link: string;
  fileName: string;
}

const DownloadLayerButton = ({ link, fileName }: DownloadLayerButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="group/download" asChild>
            <Link href={link} rel="noopener noreferrer" download={fileName}>
              <span className="sr-only">Download</span>
              <DownloadIcon
                className="!size-4 transition-colors group-hover/download:text-casper-blue-300"
                aria-hidden
              />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Download dataset</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DownloadLayerButton;
