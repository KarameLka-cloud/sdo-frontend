import {JSX} from "react";
import Cookie from "js-cookie";
import {Navigate} from "react-router-dom";

// type ProtectedRouteProps = {
//     element: JSX.Element;
//     /**
//      * `restricted` — маршрут только для НЕавторизованных (например, `/auth`).
//      * `private` — маршрут только для авторизованных (например, `/dashboard`).
//      */
//     access: "restricted" | "private";
//     redirectTo?: string;
// }
//
// function ProtectedRoute({element, access}: ProtectedRouteProps): JSX.Element {
//     const isAuth = Cookie.get("auth_token") != null;
//
//     if (access === "private" && !isAuth) {
//         return <Navigate to={redirectTo || "/"} replace/>;
//     }
//
//     if (access === "restricted" && isAuth) {
//         return <Navigate to={redirectTo || "auth"} replace/>;
//     }
//
//     return element;
// }

type ProtectedRouteProps = {
    element: JSX.Element;
}

export const ProtectedRouteLogin = ({element}: ProtectedRouteProps): JSX.Element => {
    const isAuth: boolean = Cookie.get("auth_token") == null;
    return !isAuth ? <Navigate to="/" replace/> : element;
}

export const ProtectedRouteDashboard = ({element}: ProtectedRouteProps): JSX.Element => {
    const isAuth: boolean = Cookie.get("auth_token") == null;
    return !isAuth ? element : <Navigate to="auth" replace/>;
}

export default {ProtectedRouteLogin, ProtectedRouteDashboard};
