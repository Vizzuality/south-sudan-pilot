import ContextualLayersPanel from "@/components/panels/contextual-layers";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LayersIcon from "@/svgs/layers.svg";

const ContextualLayersControls = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="yellow" className="w-8 font-sans xl:w-auto">
          <LayersIcon aria-hidden className="xl:!size-5" />
          <span className="sr-only xl:not-sr-only">Contextual layers</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        variant="light"
        className="bottom-[68px] h-[calc(100%_-_68px)] xl:bottom-0 xl:h-full"
      >
        <ContextualLayersPanel />
      </SheetContent>
    </Sheet>
  );
};

export default ContextualLayersControls;
