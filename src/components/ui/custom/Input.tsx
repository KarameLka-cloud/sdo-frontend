import React from "react";

interface InputProps {
  type: "text" | "date" | "time" | "email" | "password" | "number";
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  min?: number;
  step?: number;
  disabled?: boolean;
}

function Input({
  type,
  name,
  value,
  onChange,
  placeholder,
  className,
  required,
  min,
  step,
  disabled,
}: InputProps) {
  const getWidthClass = () => {
    switch (type) {
      case "date":
      case "time":
        return "w-fit";
      default:
        return "w-full";
    }
  };

  const getHeightClass = () => {
    switch (type) {
      case "date":
      case "time":
        return "h-9";
      default:
        return "min-h-9";
    }
  };

  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`
        ${getHeightClass()}
        ${getWidthClass()}
        py-1.5 px-2.5
        border border-gray-300
        rounded-md
        text-gray-900
        bg-white
        text-sm
        transition-all duration-200
        placeholder:text-gray-500
        disabled:opacity-70 disabled:cursor-not-allowed
        focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10
        ${className || ""}
      `}
      required={required}
      min={min}
      step={step}
      disabled={disabled}
    />
  );
}

export default Input;
