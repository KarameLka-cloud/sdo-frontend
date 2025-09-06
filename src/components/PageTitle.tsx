import {JSX} from "react";

interface PageTitlePropsType {
    title: string;
    element: JSX.Element;
}

function PageTitle({title, element}: PageTitlePropsType): JSX.Element {
    document.title = title + " - " + "СДО";
    return element;
}

export default PageTitle;
