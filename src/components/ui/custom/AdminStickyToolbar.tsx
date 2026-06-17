import { ReactNode } from "react";
import Input from "@/components/ui/custom/Input";
import IconButton from "@/components/ui/custom/IconButton";
import { useToggle } from "@/hooks/useToggle.ts";

interface AdminStickyToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  form?: ReactNode;
}

function AdminStickyToolbar({
  search,
  onSearchChange,
  form,
}: AdminStickyToolbarProps) {
  const { value: formShow, toggle: handleFormShow } = useToggle();

  return (
    <div className="sticky top-[var(--mfc-sticky-panel-top)] z-[var(--mfc-sticky-panel-z-index)] mb-[var(--mfc-sticky-panel-margin-bottom)] flex flex-col gap-4">
      <div className="flex items-center justify-between gap-[0.8rem] rounded-xl border border-[var(--mfc-create-form-border)] bg-[var(--mfc-sticky-panel-bg)] p-[var(--mfc-sticky-panel-padding)] max-[900px]:flex-col max-[900px]:items-stretch">
        {form ? (
          formShow ? (
            <IconButton type="close" onClick={handleFormShow} />
          ) : (
            <IconButton type="edit" onClick={handleFormShow} />
          )
        ) : null}
        <Input
          type="text"
          name="search"
          placeholder="🔎"
          className="w-[40%] max-w-md max-[900px]:w-full max-[900px]:max-w-none"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {form && formShow ? form : null}
    </div>
  );
}

export default AdminStickyToolbar;
