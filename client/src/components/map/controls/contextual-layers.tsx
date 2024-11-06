import ContextualLayersPanel from "@/components/panels/contextual-layers";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LayersIcon from "@/svgs/layers.svg";

const ContextualLayersControls = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="yellow" size="icon">
          <span className="sr-only">Contextual layers</span>
          <LayersIcon aria-hidden />
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
