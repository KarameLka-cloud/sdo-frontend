import { ReactNode } from "react";
import { PlusIcon, SearchIcon, XIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Field, FieldGroup } from "@/components/ui/shadcn/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/shadcn/input-group";

interface AdminListToolbarProps {
  searchId: string;
  searchPlaceholder: string;
  search: string;
  onSearchChange: (value: string) => void;
  createTo?: string;
  onCreate?: () => void;
  createLabel?: string;
  leftSlot?: ReactNode;
}

function AdminListToolbar({
  searchId,
  searchPlaceholder,
  search,
  onSearchChange,
  createTo,
  onCreate,
  createLabel,
  leftSlot,
}: AdminListToolbarProps) {
  const hasSearch = search.trim().length > 0;

  const createButton =
    createLabel && onCreate ? (
      <Button type="button" variant="outline" size="sm" onClick={onCreate}>
        <PlusIcon />
        {createLabel}
      </Button>
    ) : createLabel && createTo ? (
      <Button variant="outline" size="sm" asChild>
        <Link to={createTo}>
          <PlusIcon />
          {createLabel}
        </Link>
      </Button>
    ) : null;

  return (
    <div className="sticky mt-10">
      <Card>
        <CardContent>
          <FieldGroup className="flex flex-row items-end justify-between gap-4">
            <div className="shrink-0">{leftSlot ?? createButton}</div>
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

export default AdminListToolbar;
