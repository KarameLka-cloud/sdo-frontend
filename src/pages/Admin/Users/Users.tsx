import {JSX} from "react";
import HeaderPage from "../../../components/ui/HeaderPage/HeaderPage.tsx";
import {useGetUsersQuery} from "../../../services/store/features/userApi.ts";

function Users(): JSX.Element {
    const {data, error, isLoading} = useGetUsersQuery("");

    type UserItem = {
        id: number;
        name: string;
        login: string;
    }

    return (
        <>
            <HeaderPage>Пользователи</HeaderPage>

            {error ? (<>Error</>) : isLoading ? (<>Loading</>) : data ? (
                data.map((item: UserItem): JSX.Element => {
                    return (
                        <>
                            <div key={item.id}>{item.name}</div>
                            <div key={item.id}>{item.login}</div>
                            <hr/>
                        </>
                    )
                })
            ) : null}
        </>
    )
}

export default Users;
