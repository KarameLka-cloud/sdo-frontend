import {JSX} from "react";
import style from "./Education.module.css";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage.tsx";
import LinkService from "../../../components/ui/LinkService/LinkService.tsx";
import {ADMIN_NAV_EDUCATION_LINKS} from "../../../constants/navigation.ts";

function EducationEducation(): JSX.Element {
    return (
        <>
            <HeaderPage>Обучение</HeaderPage>

            <div className={style.links}>
                {ADMIN_NAV_EDUCATION_LINKS.map((link) => (
                    <LinkService key={link.id} link={link}/>
                ))}
            </div>
        </>
    )
}

export default EducationEducation;
