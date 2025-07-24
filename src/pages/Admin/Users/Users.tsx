import {JSX} from "react";
import style from "./Users.module.css";
import {UserType} from "../../../types/components/UserType.ts";
import ErrorData from "../../../components/ui/ErrorData/ErrorData.tsx";
import Loader from "../../../components/ui/Loader/Loader.tsx";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage.tsx";
import InputText from "../../../components/ui/InputText/InputText.tsx";
import User from "../../../components/ui/User/User.tsx";
import {useGetUsersQuery} from "../../../services/store/features/user.ts";

function Users(): JSX.Element {
    const {data, error, isLoading} = useGetUsersQuery("");

    return (
        <>
            <HeaderPage>Пользователи</HeaderPage>

            <InputText placeholder={'Поиск'} className={style.input}/>

            {error ? (
                <ErrorData/>
            ) : isLoading ? (
                <Loader/>
            ) : data ? (
                data.map((item: UserType): JSX.Element => {
                    return (
                        <User key={item.id} user={item} className={style.user}/>
                    )
                })
            ) : null}
        </>
    )
}

export default Users;
