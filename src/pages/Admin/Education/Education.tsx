import {JSX} from "react";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage.tsx";
import {Link} from "react-router-dom";

function EducationEducation(): JSX.Element {
    return (
        <>
            <HeaderPage>Обучение</HeaderPage>

            <div>
                <Link to="courses">courses</Link>
                <br/>
                <Link to="events">events</Link>
                <br/>
                <Link to="webinars">webinars</Link>
                <br/>
                <Link to="tests">tests</Link>
                <br/>
            </div>
        </>
    )
}

export default EducationEducation;
