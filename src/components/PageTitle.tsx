import {JSX} from "react";

type PageTitleProps = {
    title: string;
    element: JSX.Element;
}

function PageTitle({title, element}: PageTitleProps): JSX.Element {
    document.title = title + " - " + "СДО";
    return element;
}

export default PageTitle;
