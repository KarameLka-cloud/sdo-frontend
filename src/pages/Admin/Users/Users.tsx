import {JSX, useState} from "react";
import style from "./Users.module.css";
import {UserType} from "../../../types/api/UserType.ts";
import ErrorData from "../../../components/ui/ErrorData/ErrorData.tsx";
import Loader from "../../../components/ui/Loader/Loader.tsx";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage.tsx";
import InputText from "../../../components/ui/InputText/InputText.tsx";
import User from "../../../components/ui/User/User.tsx";
import {useGetUsersQuery} from "../../../services/store/features/user.ts";
import {useFiltered} from "../../../hooks/useFiltered.ts";

function Users(): JSX.Element {
    const {data, error, isLoading} = useGetUsersQuery("");
    const [search, setSearch] = useState("");
    const filteredUsers = useFiltered<UserType>(data, search);

    return (
        <>
            <HeaderPage>Пользователи</HeaderPage>

            <InputText placeholder={'Поиск'} className={style.input} value={search}
                       onChange={(e: any) => setSearch(e.target.value)}/>

            {error ? (
                <ErrorData/>
            ) : isLoading ? (
                <Loader/>
            ) : data ? (
                data && filteredUsers.length > 0 ? (
                    filteredUsers.map((item: UserType) => (
                        <User key={item.id} user={item} className={style.user}/>
                    ))
                ) : (
                    <p>Пользователь "{search}" не найден</p>
                )
            ) : null}
        </>
    )
}

export default Users;
