import { JSX } from "react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/shadcn/field";
import { Input } from "@/components/ui/shadcn/input";

interface DayRangeFieldsProps {
  dayFrom: string;
  dayTo: string;
  onDayFromChange: (value: string) => void;
  onDayToChange: (value: string) => void;
  idPrefix: string;
}

function DayRangeFields({
  dayFrom,
  dayTo,
  onDayFromChange,
  onDayToChange,
  idPrefix,
}: DayRangeFieldsProps): JSX.Element {
  return (
    <FieldGroup className="grid gap-4 sm:grid-cols-2">
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-day-from`}>День</FieldLabel>
        <Input
          id={`${idPrefix}-day-from`}
          type="number"
          min={1}
          value={dayFrom}
          onChange={(event) => onDayFromChange(event.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-day-to`}>
          До дня (опционально)
        </FieldLabel>
        <Input
          id={`${idPrefix}-day-to`}
          type="number"
          min={1}
          value={dayTo}
          onChange={(event) => onDayToChange(event.target.value)}
        />
      </Field>
    </FieldGroup>
  );
}

export default DayRangeFields;
