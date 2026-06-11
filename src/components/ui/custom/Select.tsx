import React, { JSX } from "react";

interface SelectProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  data: ItemProps[];
  disabled?: boolean;
}

interface ItemProps {
  id: number;
  name: string;
}

function Select({
  name,
  value,
  onChange,
  className,
  data,
  disabled,
}: SelectProps): JSX.Element {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`
        min-h-9
        py-1.5 pr-8 pl-2.5
        border border-gray-300
        rounded-md
        text-gray-900
        bg-white
        text-sm
        transition-all duration-200
        hover:border-blue-500
        focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_0.15rem_rgba(37,99,235,0.18)]
        disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-gray-100
        ${className || ""}
      `}
    >
      <option value="" disabled>
        Выбрать из списка
      </option>
      {data.map((item: ItemProps) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  );
}

export default Select;
