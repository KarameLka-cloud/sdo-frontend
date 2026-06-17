import { ReactNode } from "react";
import { PlusIcon, SearchIcon, XIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

interface AdminListToolbarProps {
  searchId: string;
  searchPlaceholder: string;
  search: string;
  onSearchChange: (value: string) => void;
  createTo?: string;
  createLabel?: string;
  leftSlot?: ReactNode;
}

function AdminListToolbar({
  searchId,
  searchPlaceholder,
  search,
  onSearchChange,
  createTo,
  createLabel,
  leftSlot,
}: AdminListToolbarProps) {
  const hasSearch = search.trim().length > 0;

  return (
    <div className="sticky mt-10">
      <Card>
        <CardContent>
          <FieldGroup className="flex flex-row items-end justify-between gap-4">
            {leftSlot ??
              (createTo && createLabel ? (
                <Button variant="outline" size="sm" asChild>
                  <Link to={createTo}>
                    <PlusIcon />
                    {createLabel}
                  </Link>
                </Button>
              ) : (
                <div />
              ))}
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
