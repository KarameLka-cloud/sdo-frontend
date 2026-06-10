import { JSX, ReactNode } from "react";

function OverflowScrollBlock({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <div className="relative h-full">
      <div className="h-full">
        <div className="h-full p-[5rem_1.5rem_1.5rem] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default OverflowScrollBlock;
