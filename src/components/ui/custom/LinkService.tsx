import { JSX } from "react";
import { Link } from "react-router-dom";

export interface LinkServiceType {
  link: {
    id: number;
    title: string;
    path: string;
  };
}

function LinkService({ link }: LinkServiceType): JSX.Element {
  return (
    <Link
      to={link.path}
      className="w-[32%] mt-4 p-4 pb-24 rounded-2xl bg-gray-200 text-gray-900 text-[1.4rem] font-semibold transition-colors duration-200 ease-in-out hover:bg-gray-700"
    >
      {link.title}
    </Link>
  );
}

export default LinkService;
