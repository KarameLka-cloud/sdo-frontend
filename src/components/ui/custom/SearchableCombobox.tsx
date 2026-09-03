import { useCallback, useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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

const DIALOG_CONTENT_SELECTOR = '[data-slot="dialog-content"]';

type SearchableComboboxProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SearchableComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  sizeToContent?: boolean;
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
  className,
  sizeToContent = false,
}: SearchableComboboxProps) {
  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  // Radix's modal dialog kills pointer events outside its subtree and traps
  // focus inside it, so a Base UI popup portaled to <body> renders but stays
  // unclickable. Keep the popup inside the dialog when there is one.
  const [dialogContainer, setDialogContainer] = useState<HTMLElement | null>(
    null,
  );
  const captureTrigger = useCallback((node: HTMLButtonElement | null) => {
    setDialogContainer(
      node?.closest<HTMLElement>(DIALOG_CONTENT_SELECTOR) ?? null,
    );
  }, []);

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
        ref={captureTrigger}
        disabled={disabled}
        className={sizeToContent ? "w-fit" : undefined}
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              "justify-between font-normal data-placeholder:text-muted-foreground",
              sizeToContent ? "w-fit" : "w-full",
              className,
            )}
          />
        }
      >
        <span className={sizeToContent ? undefined : "min-w-0 truncate"}>
          <ComboboxValue placeholder={placeholder} />
        </span>
      </ComboboxTrigger>
      <ComboboxContent container={dialogContainer ?? undefined}>
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
