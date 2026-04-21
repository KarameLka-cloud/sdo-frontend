import {JSX} from "react";
import Cookie from "js-cookie";
import {Navigate} from "react-router-dom";
import {useUser} from "@hooks/useUser.ts";
import {ROUTES} from "@constants/routes.ts";
import {COOKIE_NAMES} from "@constants/api.ts";

interface ProtectedRoutePropsType {
    elementLogin?: JSX.Element;
    elementDashboard?: JSX.Element;
    elementAdmin?: JSX.Element;
    route?: "login" | "dashboard";
}

const ProtectedRoute = ({elementDashboard, elementLogin, route}: ProtectedRoutePropsType) => {
    // const {isLoading, error} = useGetUserByDataQuery("me");
    // ВРЕМЕННО: отключена проверка авторизации
    // const isAuth = Boolean(Cookie.get(COOKIE_NAMES.AUTH_TOKEN));
    // if (isAuth) {
    //     if (route === "login") {
    //         return <Navigate to={ROUTES.HOME} replace/>;
    //     }
    //     // if (!isLoading) {
    //     //     if (error) {
    //     //         Cookie.remove("auth_token");
    //     //         return <Navigate to="login" replace/>
    //     //     }
    //     // }
    //     return elementDashboard;
    // } else {
    //     if (route === "dashboard") {
    //         return <Navigate to={ROUTES.LOGIN} replace/>;
    //     }
    //     return elementLogin;
    // }
    return elementDashboard || elementLogin;
}

const ProtectedRouteAdmin = ({elementAdmin}: ProtectedRoutePropsType) => {
    // ВРЕМЕННО: отключена проверка роли ADMIN
    // const {role} = useUser();
    // if (!role) {
    //     return null;
    // }
    // if (!role.includes("ADMIN")) {
    //     return <Navigate to={ROUTES.HOME} replace/>;
    // }
    return elementAdmin;
}

export {ProtectedRoute, ProtectedRouteAdmin};
