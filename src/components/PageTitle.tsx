import { JSX } from "react";

function PageTitle({
  title,
  element,
}: {
  title: string;
  element: JSX.Element;
}): JSX.Element {
  document.title = title + " - " + "СДО";
  return element;
}

export default PageTitle;
