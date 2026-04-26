import React, {JSX, useState} from "react";
import styles from "./Users.module.css";
import {UserType} from "@interfaces/api/UserType.ts";
import Input from "@components/ui/Input/Input.tsx";
import User from "@components/ui/User/User.tsx";
import Loader from "@components/ui/Loader/Loader.tsx";
import DataMessage from "@components/ui/DataMessage/DataMessage.tsx";
import {useFiltered} from "@hooks/useFiltered.ts";
import {useGetUsersQuery} from "@services/store/features/user.ts";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";

type UsersTab = "users" | "admins" | "mentors" | "department_heads";

function Users(): JSX.Element {
    const {data, error, isLoading} = useGetUsersQuery("");
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<UsersTab>("users");
    const filteredUsers = useFiltered<UserType>(data, search);

    // Фильтруем администраторов (ADMIN)
    const admins = data?.filter((user: UserType) => user.role === "ADMIN") || [];
    const filteredAdmins = useFiltered<UserType>(admins, search);

    // Фильтруем кураторов/наставников (MENTOR)
    const curators = data?.filter((user: UserType) => user.role === "MENTOR") || [];
    const filteredCurators = useFiltered<UserType>(curators, search);

    // Фильтруем начальников отделов (DEPARTMENT_HEAD)
    const heads = data?.filter((user: UserType) => user.role === "DEPARTMENT_HEAD") || [];
    const filteredHeads = useFiltered<UserType>(heads, search);

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
                    className={`${styles.tabButton} ${activeTab === "department_heads" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("department_heads")}
                >
                    Руководители отделов
                </button>
                <button
                    type="button"
                    className={`${styles.tabButton} ${activeTab === "mentors" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("mentors")}
                >
                    Наставники
                </button>
            </div>

            <div className={styles.searchContainer}>
                <Input type={"text"} name={"search"} placeholder={'Поиск'} className={styles.input} value={search}
                       onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSearch(e.target.value)}/>
            </div>

            <div className={styles.content}>
                {activeTab === "users" && (
                    <>
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
                    </>
                )}

                {activeTab === "admins" && (
                    <>
                        {error ? (
                            <DataMessage type={"error"}/>
                        ) : isLoading ? (
                            <Loader/>
                        ) : filteredAdmins ? (
                            filteredAdmins.length > 0 ? (
                                filteredAdmins.map((item: UserType) => (
                                    <User key={item.id} user={item} className={styles.user}/>
                                ))
                            ) : (
                                <p>Администратор "{search}" не найден</p>
                            )
                        ) : null}
                    </>
                )}

                {activeTab === "mentors" && (
                    <>
                        {error ? (
                            <DataMessage type={"error"}/>
                        ) : isLoading ? (
                            <Loader/>
                        ) : filteredCurators ? (
                            filteredCurators.length > 0 ? (
                                filteredCurators.map((item: UserType) => (
                                    <User key={item.id} user={item} className={styles.user}/>
                                ))
                            ) : (
                                <p>Наставник "{search}" не найден</p>
                            )
                        ) : null}
                    </>
                )}

                {activeTab === "department_heads" && (
                    <>
                        {error ? (
                            <DataMessage type={"error"}/>
                        ) : isLoading ? (
                            <Loader/>
                        ) : filteredHeads ? (
                            filteredHeads.length > 0 ? (
                                filteredHeads.map((item: UserType) => (
                                    <User key={item.id} user={item} className={styles.user}/>
                                ))
                            ) : (
                                <p>Руководитель отдела "{search}" не найден</p>
                            )
                        ) : null}
                    </>
                )}
            </div>
        </OverflowScrollBlock>
    )
}

export default Users;
