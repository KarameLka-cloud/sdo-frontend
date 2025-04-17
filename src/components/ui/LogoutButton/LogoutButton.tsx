import { JSX } from "react";
import style from "./LogoutButton.module.css";

function LogoutButton({
  className = "",
  ...props
}: {
  className: string;
  [x: string]: unknown;
}): JSX.Element {
  return (
    <div className={`${style.component} + ${className}`} {...props}>
      <svg
        className={style.img}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          d="M320 176v-40a40 40 0 0 0-40-40H88a40 40 0 0 0-40 40v240a40 40 0 0 0 40 40h192a40 40 0 0 0 40-40v-40"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        ></path>
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
          d="M384 176l80 80l-80 80"
        ></path>
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
          d="M191 256h273"
        ></path>
      </svg>
    </div>
  );
}

export default LogoutButton;
