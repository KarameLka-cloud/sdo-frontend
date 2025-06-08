import {JSX} from "react";
import style from "./Home.module.css";
import dateNow from "../../../utils/dateNow.ts";
import {useGetUserByDataQuery} from "../../../services/store/features/userApi.ts";

function Home(): JSX.Element {
    const {data, error, isLoading} = useGetUserByDataQuery("me");

    function getName(userName: string): string {
        return userName.split(" ")[1];
    }

    return (
        <>
            {error ? (
                <>Ошибка получения данных</>
            ) : isLoading ? (
                <>Загрузка...</>
            ) : data ? (
                <>
                    <div className={style.info_component}>
                        <div className={style.info_date}>{dateNow}</div>
                        <div className={style.info_name}>{`Привет, ${getName(
                            data.name
                        )}`}</div>
                        <div className={style.info_department}>{data.department}</div>
                        <div className={style.info_description}>{data.description}</div>
                        <img
                            className={style.info_img}
                            src="/src/assets/images/my_info.svg"
                            alt="Девушка"
                        />
                    </div>
                </>
            ) : null}
        </>
    );
}

export default Home;
