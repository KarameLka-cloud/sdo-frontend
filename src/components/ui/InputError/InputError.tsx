import { JSX } from "react";

function InputError({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}): JSX.Element {
  return <p className={"text-sm text-red-600 " + className}>{children}</p>;
}

export default InputError;
