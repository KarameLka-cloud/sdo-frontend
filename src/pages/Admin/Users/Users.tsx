import React, {JSX, useState} from "react";
import styles from "./Users.module.css";
import {UserType} from "@interfaces/api/UserType.ts";
import Input from "@components/ui/Input/Input.tsx";
import User from "@components/ui/User/User.tsx";
import Loader from "@components/ui/Loader/Loader.tsx";
import DataMessage from "@components/ui/DataMessage/DataMessage.tsx";
import Development from "@components/ui/Development/Development.tsx";
import {useFiltered} from "@hooks/useFiltered.ts";
import {useGetUsersQuery} from "@services/store/features/user.ts";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";

type UsersTab = "users" | "admins" | "curators" | "heads";

function Users(): JSX.Element {
    const {data, error, isLoading} = useGetUsersQuery("");
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<UsersTab>("users");
    const filteredUsers = useFiltered<UserType>(data, search);

    return (
        <OverflowScrollBlock header_name={'Пользователи'}>
            <div className={styles.tabs}>
                <button
                    type="button"
                    className={`${styles.tabButton} ${activeTab === "users" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("users")}
                >
                    Все пользователи
                </button>
                <button
                    type="button"
                    className={`${styles.tabButton} ${activeTab === "admins" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("admins")}
                >
                    Администраторы
                </button>
                <button
                    type="button"
                    className={`${styles.tabButton} ${activeTab === "heads" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("heads")}
                >
                    Начальники отделов
                </button>
                <button
                    type="button"
                    className={`${styles.tabButton} ${activeTab === "curators" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("curators")}
                >
                    Кураторы
                </button>
            </div>

            {activeTab === "users" && (
                <>
                    <Input type={"text"} name={"search"} placeholder={'Поиск'} className={styles.input} value={search}
                           onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSearch(e.target.value)}/>
                    <div>
                        {error ? (
                            <DataMessage type={"error"}/>
                        ) : isLoading ? (
                            <Loader/>
                        ) : data ? (
                            data && filteredUsers.length > 0 ? (
                                filteredUsers.map((item: UserType) => (
                                    <User key={item.id} user={item} className={styles.user}/>
                                ))
                            ) : (
                                <p>Пользователь "{search}" не найден</p>
                            )
                        ) : null}
                    </div>
                </>
            )}

            {activeTab === "admins" && <Development/>}
            {activeTab === "curators" && <Development/>}
            {activeTab === "heads" && <Development/>}
        </OverflowScrollBlock>
    )
}

export default Users;
