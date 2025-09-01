import {JSX} from "react";
import style from "./Home.module.css";
import my_info from "../../../assets/images/my_info.svg";
import dateNow from "../../../utils/dateNow.ts";
import {useUser} from "../../../hooks/useUser.ts";

function Home(): JSX.Element {
    const {name, department, description} = useUser();

    return (
        <>
            <div className={style.info_component}>
                <div className={style.info_date}>{dateNow}</div>
                <div className={style.info_name}>{`Привет, ${name.split(" ")[1]}`}</div>
                <div className={style.info_department}>{department}</div>
                <div className={style.info_description}>{description}</div>
                <img
                    className={style.info_img}
                    src={my_info}
                    alt="Девушка"
                />
            </div>
        </>
    );
}

export default Home;
