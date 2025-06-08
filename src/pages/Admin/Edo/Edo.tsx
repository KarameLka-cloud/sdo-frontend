import {JSX} from "react";
import {Link} from "react-router-dom";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage.tsx";

function Edo(): JSX.Element {
    return (
        <>
            <HeaderPage>Единый день обучения</HeaderPage>
            <div>
                <Link to="courses">courses</Link>
                <br/>
                <Link to="events">events</Link>
                <br/>
                <Link to="tests">tests</Link>
                <br/>
            </div>
        </>
    )
}

export default Edo;
