"use client";

import { getYear } from "date-fns";
import { addYears } from "date-fns/addYears";
import { format } from "date-fns/format";
import { setMonth } from "date-fns/setMonth";
import { setYear } from "date-fns/setYear";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ChevronDownIcon from "@/svgs/chevron-down.svg";

interface MonthPickerProps {
  // Selected date (YYYY-MM-DD)
  selected: string;
  // Minimum date (YYYY-MM-DD). The code assumes that the whole year is available (from Jan 1st).
  minDate: string;
  // Maximum date (YYYY-MM-DD). The code assumes that the whole year is available (until Dec 31st).
  maxDate: string;
  // Callback executed when the selected date is modified
  onSelect: (selected: string) => void;
}

const MonthPicker = ({ selected, minDate, maxDate, onSelect }: MonthPickerProps) => {
  const [mode, setMode] = useState("month");

  const onClickPreviousYear = useCallback(() => {
    const newDate = addYears(selected, -1);
    if (getYear(newDate) >= getYear(minDate)) {
      onSelect(format(newDate, "yyyy-MM-dd"));
    }
  }, [selected, minDate, onSelect]);

  const onClickNextYear = useCallback(() => {
    const newDate = addYears(selected, 1);
    if (getYear(newDate) <= getYear(maxDate)) {
      onSelect(format(newDate, "yyyy-MM-dd"));
    }
  }, [selected, maxDate, onSelect]);

  const onSelectMonth = useCallback(
    (month: number) => {
      const newDate = setMonth(selected, month);
      onSelect(format(newDate, "yyyy-MM-dd"));
    },
    [selected, onSelect],
  );

  const onSelectYear = useCallback(
    (year: number) => {
      const newDate = setYear(selected, year);
      onSelect(format(newDate, "yyyy-MM-dd"));
      setMode("month");
    },
    [selected, onSelect, setMode],
  );

  return (
    <div className="border border-rhino-blue-950 p-2">
      {mode === "month" && (
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-7 hover:bg-casper-blue-200"
            onClick={onClickPreviousYear}
          >
            <span className="sr-only">Previous year</span>
            <ChevronDownIcon aria-hidden className="rotate-90" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="hover:bg-casper-blue-200 xl:h-auto xl:py-1"
            onClick={() => setMode("year")}
          >
            <span className="sr-only">Select year. Current: </span>
            {format(selected, "yyyy")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-7 hover:bg-casper-blue-200"
            onClick={onClickNextYear}
          >
            <span className="sr-only">Next year</span>
            <ChevronDownIcon aria-hidden className="-rotate-90" />
          </Button>
        </div>
      )}

      <div
        className={cn({
          "mt-1 grid w-full gap-1": true,
          "grid-cols-3": mode === "month",
          "grid-cols-4": mode === "year",
        })}
      >
        {mode === "month" &&
          Array.from({ length: 12 }).map((_, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              className="hover:bg-casper-blue-200 aria-pressed:bg-rhino-blue-900 aria-pressed:text-white"
              aria-pressed={
                format(selected, "MM") === format(`${index + 1}`.padStart(2, "0"), "MM")
              }
              onClick={() => onSelectMonth(index)}
            >
              {format(`${index + 1}`.padStart(2, "0"), "MMM")}
            </Button>
          ))}
        {mode === "year" &&
          Array.from({ length: getYear(maxDate) - getYear(minDate) + 1 }).map((_, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              className="hover:bg-casper-blue-200 aria-pressed:bg-rhino-blue-900 aria-pressed:text-white xl:h-auto xl:py-1"
              aria-pressed={format(selected, "yyyy") === `${getYear(minDate) + index}`}
              onClick={() => onSelectYear(getYear(minDate) + index)}
            >
              {getYear(minDate) + index}
            </Button>
          ))}
      </div>
    </div>
  );
};

export default MonthPicker;
