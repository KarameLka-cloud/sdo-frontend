import {JSX} from "react";
import Cookie from "js-cookie";
import {Navigate} from "react-router-dom";
import {useGetUserByDataQuery} from "../../services/store/features/user.ts";

type ProtectedRoutePropsType = {
    elementLogin?: JSX.Element;
    elementDashboard?: JSX.Element;
    elementAdmin?: JSX.Element;
    route?: "login" | "dashboard";
}

const ProtectedRoute = ({elementDashboard, elementLogin, route}: ProtectedRoutePropsType) => {
    // const {isLoading, error} = useGetUserByDataQuery("me");
    const isAuth = Boolean(Cookie.get("auth_token"));
    if (isAuth) {
        if (route === "login") {
            return <Navigate to="/" replace/>;
        }
        // if (!isLoading) {
        //     if (error) {
        //         Cookie.remove("auth_token");
        //         return <Navigate to="login" replace/>
        //     }
        // }
        return elementDashboard;
    } else {
        if (route === "dashboard") {
            return <Navigate to="login" replace/>;
        }
        return elementLogin;
    }
}

const ProtectedRouteAdmin = ({elementAdmin}: ProtectedRoutePropsType) => {
    const {data: user, isLoading} = useGetUserByDataQuery("me");
    if (!isLoading) {
        if (user?.role !== "admin") {
            return <Navigate to="home" replace/>;
        }
    }
    return elementAdmin;
};

export {ProtectedRoute, ProtectedRouteAdmin};
