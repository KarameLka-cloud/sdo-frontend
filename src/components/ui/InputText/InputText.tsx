import { JSX } from "react";

function InputText({
  className = "",
  ...props
}: {
  className?: string;
  [x: string]: unknown;
}): JSX.Element {
  return (
    <input
      {...props}
      className={
        "border border-gray-300 rounded-lg text-sm text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 " +
        className
      }
    />
  );
}

export default InputText;
