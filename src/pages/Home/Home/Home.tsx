import {JSX} from "react";
import style from "./Home.module.css";
import image_fox from "../../../assets/images/fox.png";
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
                    src={image_fox}
                    alt="Девушка"
                />
            </div>
        </>
    );
}

export default Home;
