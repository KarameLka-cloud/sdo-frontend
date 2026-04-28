import { JSX, useEffect } from "react";

interface PageTitlePropsType {
  title: string;
  element: JSX.Element;
}

function PageTitle({ title, element }: PageTitlePropsType): JSX.Element {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} - СДО`;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  return element;
}

export default PageTitle;
