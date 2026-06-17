import { JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DataMessageProps {
  type: "noData" | "error";
  className?: string;
  centered?: boolean;
}

export function DataStateCenter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-1 items-center justify-center py-8 min-h-[calc(100dvh-12rem)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function DataMessage({
  type,
  className,
  centered = false,
}: DataMessageProps): JSX.Element {
  const types = {
    noData: {
      message: "Список пуст (ﾉ◕ヮ◕)ﾉ",
    },
    error: {
      message: "Ошибка получения данных Σ(▼□▼メ)",
    },
  };

  const { message } = types[type];

  const messageEl = (
    <div
      className={cn(
        "w-fit px-4 py-3",
        "border border-gray-200 rounded-xl",
        "bg-slate-50 text-gray-600",
        "text-center text-base font-semibold",
        className,
      )}
    >
      {message}
    </div>
  );

  if (!centered) return messageEl;

  return <DataStateCenter>{messageEl}</DataStateCenter>;
}

export default DataMessage;
