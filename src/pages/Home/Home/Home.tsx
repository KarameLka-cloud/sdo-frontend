import {JSX} from "react";
import style from "./Home.module.css";
import my_info from "../../../assets/images/my_info.svg";
import ErrorData from "../../../components/ui/ErrorData/ErrorData.tsx";
import Loader from "../../../components/ui/Loader/Loader.tsx";
import dateNow from "../../../utils/dateNow.ts";
import {useGetUserByDataQuery} from "../../../services/store/features/user.ts";

function Home(): JSX.Element {
    const {data: user, error, isLoading} = useGetUserByDataQuery("");

    function getName(userName: string): string {
        return userName.split(" ")[1];
    }

    return (
        <>
            {error ? (
                <ErrorData/>
            ) : isLoading ? (
                <Loader/>
            ) : user ? (
                <>
                    <div className={style.info_component}>
                        <div className={style.info_date}>{dateNow}</div>
                        <div className={style.info_name}>{`Привет, ${getName(
                            user.name
                        )}`}</div>
                        <div className={style.info_department}>{user.department}</div>
                        <div className={style.info_description}>{user.description}</div>
                        <img
                            className={style.info_img}
                            src={my_info}
                            alt="Девушка"
                        />
                    </div>
                </>
            ) : null}
        </>
    );
}

export default Home;
