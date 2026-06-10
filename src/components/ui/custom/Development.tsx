import { JSX } from "react";
import image_development from "@/assets/images/development.svg";

interface DevelopmentType {
  className?: string;
}

function Development({ className }: DevelopmentType): JSX.Element {
  return (
    <div>
      <img
        src={image_development}
        alt="В разработке"
        className={`block w-3/5 mx-auto ${className ?? ""}`}
      />
    </div>
  );
}

export default Development;
