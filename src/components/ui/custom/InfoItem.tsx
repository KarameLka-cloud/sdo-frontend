import type { JSX } from "react";

interface InfoItemProps {
  label: string;
  value?: string;
}

/**
 * Label/value pair for detail dialogs. Must be rendered inside a `<dl>`.
 * A trailing colon in `label` is dropped so LDAP-style labels ("Отдел:")
 * and plain ones render identically.
 */
function InfoItem({ label, value }: InfoItemProps): JSX.Element {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm text-muted-foreground">
        {label.replace(/:$/, "")}
      </dt>
      <dd className="text-sm font-medium break-words">{value || "—"}</dd>
    </div>
  );
}

export default InfoItem;
