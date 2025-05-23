import {JSX} from "react";
import style from "./Users.module.css";
import {useGetUsersQuery} from "../../../services/store/features/userApi.ts";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage.tsx";
import InputText from "../../../components/ui/InputText/InputText.tsx";

function Users(): JSX.Element {
    const {data, error, isLoading} = useGetUsersQuery("");

    type UserItem = {
        id: number;
        name: string;
        department: string;
    }

    return (
        <>
            <HeaderPage>Пользователи</HeaderPage>

            <InputText className={style.input}/>

            {error ? (<>Error</>) : isLoading ? (<>Loading</>) : data ? (
                data.map((item: UserItem): JSX.Element => {
                    return (
                        <>
                            <div key={item.id}>{item.name}</div>
                            <div key={item.id}>{item.department}</div>
                            <hr/>
                        </>
                    )
                })
            ) : null}
        </>
    )
}

export default Users;
