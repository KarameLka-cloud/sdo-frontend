import { JSX } from "react";
import { Button } from "@/components/ui/shadcn/button";
import type {
  ResponsibleRole,
  TaskStatus,
} from "@/interfaces/api/AdaptationPlanType.ts";

const toExternalUrl = (link: string): string => {
  const trimmedLink = link.trim();

  if (/^https?:\/\//i.test(trimmedLink)) {
    return trimmedLink;
  }

  return `https://${trimmedLink}`;
};

const STATUS_OPTIONS = [
  { value: "не выполнено", label: "Не выполнено" },
  { value: "выполнено", label: "Выполнено" },
] as const;

export interface PlanTaskRowProps {
  description: string;
  status: TaskStatus;
  responsibleRole?: ResponsibleRole;
  links?: string[] | null;
  disabled?: boolean;
  onStatusChange: (status: TaskStatus) => void;
}

function PlanTaskRow({
  description,
  status,
  responsibleRole,
  links,
  disabled = false,
  onStatusChange,
}: PlanTaskRowProps): JSX.Element {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 max-sm:grid-cols-1">
      <div className="flex flex-col gap-2">
        <span className="text-sm">{description}</span>

        {responsibleRole && (
          <span className="text-xs text-muted-foreground">
            Ответственный: {responsibleRole}
          </span>
        )}

        {links && links.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-xs text-muted-foreground">Ссылки:</span>
            {links.map((link, index) => (
              <a
                key={`${link}-${index}`}
                href={toExternalUrl(link)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-xs underline-offset-4 hover:underline"
              >
                Ссылка {index + 1}
              </a>
            ))}
          </div>
        )}
      </div>

      <div
        className="flex shrink-0 items-center gap-2"
        role="group"
        aria-label="Статус задачи"
      >
        {STATUS_OPTIONS.map((option) => {
          const isActive = status === option.value;

          return (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={isActive ? "default" : "outline"}
              disabled={disabled}
              aria-pressed={isActive}
              onClick={() => onStatusChange(option.value)}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default PlanTaskRow;
