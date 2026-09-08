import { Field, FieldLabel } from "@/components/ui/shadcn/field";
import SearchableCombobox from "@/components/ui/custom/SearchableCombobox";
import { ROLE_USER_FIELDS } from "@/constants/adaptation.ts";
import type { UserType } from "@/interfaces/api/UserType.ts";
import { toUserOptions } from "@/utils/userSelectOptions.ts";

type RoleUserField = keyof typeof ROLE_USER_FIELDS;

function RoleUserCombobox({
  field,
  value,
  onValueChange,
  users,
  disabled = false,
}: {
  field: RoleUserField;
  value: string;
  onValueChange: (value: string) => void;
  users: UserType[];
  disabled?: boolean;
}) {
  const copy = ROLE_USER_FIELDS[field];

  return (
    <Field>
      <FieldLabel htmlFor={copy.id}>{copy.label}</FieldLabel>
      <SearchableCombobox
        id={copy.id}
        value={value}
        onValueChange={onValueChange}
        options={toUserOptions(users)}
        placeholder={copy.placeholder}
        searchPlaceholder={copy.searchPlaceholder}
        emptyMessage={copy.emptyMessage}
        disabled={disabled}
      />
    </Field>
  );
}

export default RoleUserCombobox;
