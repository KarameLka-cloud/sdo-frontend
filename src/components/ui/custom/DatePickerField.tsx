import { useState } from "react";
import { format } from "date-fns";
import { ru as ruDateFns } from "date-fns/locale";
import { ru } from "react-day-picker/locale";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { Calendar } from "@/components/ui/shadcn/calendar";
import { Field, FieldLabel } from "@/components/ui/shadcn/field";
import { Input } from "@/components/ui/shadcn/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { cn } from "@/lib/utils";
import { toDateInputValue } from "@/utils/formValues.ts";
import convertDate from "@/utils/convertDate.ts";

const parseDateValue = (value?: string) => {
  const normalized = toDateInputValue(value);
  if (!normalized) return undefined;

  const [year, month, day] = normalized.split("-").map(Number);
  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day);
};

const TIME_INPUT_CLASS =
  "appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none";

function DatePickerField({
  dateId,
  dateLabel,
  date,
  onDateChange,
  datePlaceholder = "Выберите дату",
  compact = false,
  fitContent = false,
  className,
  showTime = false,
  timeId,
  timeLabel = "Время",
  time = "",
  onTimeChange,
}: {
  dateId: string;
  dateLabel: string;
  date: string;
  onDateChange: (value: string) => void;
  datePlaceholder?: string;
  compact?: boolean;
  fitContent?: boolean;
  className?: string;
  showTime?: boolean;
  timeId?: string;
  timeLabel?: string;
  time?: string;
  onTimeChange?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseDateValue(date);

  const datePicker = (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={compact ? "ghost" : "outline"}
          id={dateId}
          className={
            compact
              ? "h-7 gap-1 px-1.5 font-medium hover:bg-background/70"
              : fitContent
                ? "w-fit justify-between font-normal"
                : "w-full justify-between font-normal"
          }
        >
          {selectedDate
            ? compact
              ? convertDate(date)
              : format(selectedDate, "PPP", { locale: ruDateFns })
            : datePlaceholder}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-[60] w-auto overflow-hidden p-0"
        align="start"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          captionLayout="dropdown"
          defaultMonth={selectedDate}
          locale={ru}
          onSelect={(nextDate) => {
            onDateChange(nextDate ? format(nextDate, "yyyy-MM-dd") : "");
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );

  if (compact) {
    return (
      <div className="flex min-w-0 items-center gap-2">
        <FieldLabel
          htmlFor={dateId}
          className="shrink-0 text-xs font-normal text-muted-foreground"
        >
          {dateLabel}
        </FieldLabel>
        {datePicker}
      </div>
    );
  }

  return (
    <>
      <Field
        className={cn(fitContent ? "w-fit *:w-auto" : undefined, className)}
      >
        <FieldLabel htmlFor={dateId}>{dateLabel}</FieldLabel>
        {datePicker}
      </Field>
      {showTime && timeId && onTimeChange && (
        <Field
          className={cn(fitContent ? "w-fit *:w-auto" : undefined, className)}
        >
          <FieldLabel htmlFor={timeId}>{timeLabel}</FieldLabel>
          <Input
            type="time"
            id={timeId}
            step="60"
            value={time.slice(0, 5)}
            onChange={(event) =>
              onTimeChange(event.target.value.slice(0, 5))
            }
            className={`${TIME_INPUT_CLASS}${fitContent ? " w-auto field-sizing-content" : ""}`}
          />
        </Field>
      )}
    </>
  );
}

export default DatePickerField;
