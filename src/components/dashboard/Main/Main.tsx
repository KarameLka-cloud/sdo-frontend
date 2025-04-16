import { JSX } from "react";

function Main({
  children,
  className = "",
}: {
  children?: JSX.Element;
  className?: string;
}): JSX.Element {
  return (
    <main className={"w-full bg-gray-50 p-6 " + className}>{children}</main>
  );
}

export default Main;
