import { getMonth } from "date-fns";
import { format } from "date-fns/format";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import MonthPicker from "@/components/ui/month-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import CalendarDaysIcon from "@/svgs/calendar-days.svg";
import ChevronDownIcon from "@/svgs/chevron-down.svg";
import PauseIcon from "@/svgs/pause.svg";
import PlayIcon from "@/svgs/play.svg";
import { DatasetLayersDataItem } from "@/types/generated/strapi.schemas";
import { LayerParamsConfig } from "@/types/layer";

interface DateControlsProps {
  layer: DatasetLayersDataItem;
  date: string;
  onChangeDate: (date: string) => void;
}

const DateControls = ({ layer, date, onChangeDate }: DateControlsProps) => {
  const [isAnimated, setIsAnimated] = useState(false);

  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Date that was selected before the animation is played
  const dateBeforeAnimationRef = useRef<string | null>(null);

  const dateRange = useMemo(() => {
    const paramsConfig = layer.attributes!.params_config! as LayerParamsConfig;
    return paramsConfig.find(({ key }) => key === "date-range")?.default as [string, string];
  }, [layer]);

  const onToggleAnimation = useCallback(() => {
    const newIsAnimated = !isAnimated;

    if (newIsAnimated) {
      dateBeforeAnimationRef.current = date;
    } else {
      dateBeforeAnimationRef.current = null;
    }

    setIsAnimated(newIsAnimated);
  }, [date, isAnimated, setIsAnimated]);

  const onChangeSelectedDate = useCallback(
    (date: string) => {
      onChangeDate(date);
    },
    [onChangeDate],
  );

  // When the layer is animated, show each month of the year in a loop
  useEffect(() => {
    if (isAnimated) {
      animationIntervalRef.current = setInterval(() => {
        const newDate = format(new Date(date).setMonth((getMonth(date) + 1) % 12), "yyyy-MM-dd");

        onChangeDate(newDate);
      }, 500);
    } else if (animationIntervalRef.current !== null) {
      clearInterval(animationIntervalRef.current);
    }

    return () => {
      if (animationIntervalRef.current !== null) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [layer.id, date, isAnimated, onChangeDate]);

  if (date === undefined && dateRange === undefined) {
    return null;
  }

  return (
    <div className="mt-1 flex items-center justify-between gap-4">
      <Button
        type="button"
        variant="ghost"
        size="auto"
        className="hidden h-6 w-6 rounded-full border border-rhino-blue-950 hover:border-rhino-blue-800 hover:text-rhino-blue-800 lg:inline-flex"
        aria-pressed={isAnimated}
        onClick={onToggleAnimation}
      >
        <span className="sr-only">Play layer animation</span>
        {!isAnimated && <PlayIcon className="!size-4 transition-colors" aria-hidden />}
        {isAnimated && <PauseIcon className="!size-4 transition-colors" aria-hidden />}
      </Button>
      <div className="flex w-full items-center gap-2 lg:w-auto">
        <Label
          htmlFor={`layer-${layer.id}-date`}
          className={cn({
            "shrink-0 text-xs font-medium": true,
            "pointer-events-none opacity-60": isAnimated,
          })}
        >
          Displayed on map
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={`layer-${layer.id}-date`}
              type="button"
              variant="yellow"
              className="group/month-picker max-w-[220px] flex-grow justify-between px-3 disabled:bg-rhino-blue-50 disabled:text-rhino-blue-950/60 disabled:opacity-100 lg:flex-grow-0 xl:h-auto xl:py-1.5"
              disabled={isAnimated}
            >
              <CalendarDaysIcon aria-hidden />
              {format(isAnimated ? dateBeforeAnimationRef.current! : date, "MMMM, yyyy")}
              <ChevronDownIcon
                className="ml-auto group-data-[state=open]/month-picker:rotate-180"
                aria-hidden
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="end" sideOffset={2} className="w-[220px]">
            <MonthPicker
              selected={isAnimated ? dateBeforeAnimationRef.current! : date}
              minDate={dateRange[0]}
              maxDate={dateRange[1]}
              onSelect={onChangeSelectedDate}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateControls;
