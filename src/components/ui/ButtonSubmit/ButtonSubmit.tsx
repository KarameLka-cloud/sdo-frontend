import { JSX } from "react";

function ButtonSubmit({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}): JSX.Element {
  return (
    <button
      type="submit"
      className={
        "rounded-lg text-xs text-white font-medium text-center uppercase bg-gray-700 hover:bg-gray-800 cursor-pointer " +
        className
      }
    >
      {children}
    </button>
  );
}

export default ButtonSubmit;
