import DatasetMetadata from "@/components/dataset-metadata";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import QuestionMarkIcon from "@/svgs/question-mark.svg";
import { MetadataItemComponent } from "@/types/generated/strapi.schemas";

interface MetadataButtonProps {
  datasetName: string;
  metadata: MetadataItemComponent;
}

const MetadataButton = ({ datasetName, metadata }: MetadataButtonProps) => {
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="group/info">
                <span className="sr-only">Information</span>
                <QuestionMarkIcon
                  className="!size-4 transition-colors group-hover/info:text-casper-blue-300"
                  aria-hidden
                />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>More info</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DatasetMetadata name={datasetName} metadata={metadata} />
      </DialogContent>
    </Dialog>
  );
};

export default MetadataButton;
