import { JSX } from "react";

interface DataMessageProps {
  type: "noData" | "error";
  className?: string;
}

function DataMessage({ type, className }: DataMessageProps): JSX.Element {
  const types = {
    noData: {
      message: "Список пуст (ﾉ◕ヮ◕)ﾉ",
    },
    error: {
      message: "Ошибка получения данных Σ(▼□▼メ)",
    },
  };

  const { message } = types[type];

  return (
    <div
      className={`
        w-fit mx-auto mt-2 px-4 py-3
        border border-gray-200 rounded-xl
        bg-slate-50 text-gray-600
        text-center text-base font-semibold
        ${className}
      `}
    >
      {message}
    </div>
  );
}

export default DataMessage;
