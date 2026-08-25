import { useMemo } from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { InputGroupAddon } from "@/components/ui/shadcn/input-group";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/shadcn/combobox";

export type SearchableComboboxOption = {
  value: string;
  label: string;
};

type SearchableComboboxProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SearchableComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
};

function SearchableCombobox({
  id,
  value,
  onValueChange,
  options,
  placeholder = "Выберите значение",
  searchPlaceholder = "Поиск...",
  emptyMessage = "Ничего не найдено",
  disabled,
}: SearchableComboboxProps) {
  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  return (
    <Combobox
      items={options}
      value={selected}
      onValueChange={(item) => onValueChange(item?.value ?? "")}
      itemToStringLabel={(item) => item.label}
      isItemEqualToValue={(item, current) => item.value === current.value}
      autoHighlight
      disabled={disabled}
    >
      <ComboboxTrigger
        id={id}
        disabled={disabled}
        render={
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between font-normal data-placeholder:text-muted-foreground"
          />
        }
      >
        <span className="min-w-0 truncate">
          <ComboboxValue placeholder={placeholder} />
        </span>
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput
          showTrigger={false}
          placeholder={searchPlaceholder}
          className="w-full"
        >
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </ComboboxInput>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export default SearchableCombobox;
