import React, {JSX, useState} from "react";
import style from "./Users.module.css";
import {UserType} from "../../../interfaces/api/UserType.ts";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage.tsx";
import Input from "../../../components/ui/Input/Input.tsx";
import User from "../../../components/ui/User/User.tsx";
import Loader from "../../../components/ui/Loader/Loader.tsx";
import DataMessage from "../../../components/ui/DataMessage/DataMessage.tsx";
import {useFiltered} from "../../../hooks/useFiltered.ts";
import {useGetUsersQuery} from "../../../services/store/features/user.ts";

function Users(): JSX.Element {
    const {data, error, isLoading} = useGetUsersQuery("");
    const [search, setSearch] = useState("");
    const filteredUsers = useFiltered<UserType>(data, search);

    return (
        <>
            <HeaderPage>Пользователи</HeaderPage>

            <Input type={"text"} name={"search"} placeholder={'Поиск'} className={style.input} value={search}
                   onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSearch(e.target.value)}/>

            {error ? (
                <DataMessage type={"error"}/>
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
