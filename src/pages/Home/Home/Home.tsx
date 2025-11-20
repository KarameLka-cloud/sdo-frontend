import {JSX} from "react";
import styles from "./Home.module.css";
import image_fox from "@assets/images/fox.png";
import dateNow from "@utils/dateNow.ts";
import {useUser} from "@hooks/useUser.ts";

function Home(): JSX.Element {
    const {name, department, description} = useUser();

    return (
        <div className={styles.container}>
            <div className={styles.info_component}>
                <div className={styles.info_date}>{dateNow}</div>
                <div className={styles.info_name}>{`Привет, ${name.split(" ")[1]}`} 👋</div>
                <div className={styles.info_department}>{department}</div>
                <div className={styles.info_description}>{description}</div>
                <img
                    className={styles.info_img}
                    src={image_fox}
                    alt="Девушка"
                />
            </div>
        </div>
    );
}

export default Home;
