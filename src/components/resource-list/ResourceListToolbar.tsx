import { ReactNode } from "react";
import { PlusIcon, SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Field, FieldGroup } from "@/components/ui/shadcn/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/shadcn/input-group";

interface ResourceListToolbarProps {
  searchId: string;
  searchPlaceholder: string;
  search: string;
  onSearchChange: (value: string) => void;
  onCreate?: () => void;
  createLabel?: string;
  leftSlot?: ReactNode;
  searchCentered?: boolean;
}

function ResourceListToolbar({
  searchId,
  searchPlaceholder,
  search,
  onSearchChange,
  onCreate,
  createLabel,
  leftSlot,
  searchCentered = false,
}: ResourceListToolbarProps) {
  const hasSearch = search.trim().length > 0;

  const createButton =
    createLabel && onCreate ? (
      <Button type="button" variant="outline" size="sm" onClick={onCreate}>
        <PlusIcon />
        {createLabel}
      </Button>
    ) : null;

  return (
    <div className="sticky mt-10">
      <Card>
        <CardContent>
          <FieldGroup
            className={
              searchCentered
                ? "flex flex-row items-end justify-center gap-4"
                : "flex flex-row items-end justify-between gap-4"
            }
          >
            {!searchCentered && (
              <div className="shrink-0">{leftSlot ?? createButton}</div>
            )}
            <Field className="w-2/4">
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput
                  id={searchId}
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                {hasSearch && (
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      aria-label="Очистить поиск"
                      onClick={() => onSearchChange("")}
                    >
                      <XIcon />
                    </InputGroupButton>
                  </InputGroupAddon>
                )}
              </InputGroup>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResourceListToolbar;
