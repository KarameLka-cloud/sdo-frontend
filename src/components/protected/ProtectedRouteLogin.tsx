import {JSX} from "react";
import Cookie from "js-cookie";
import {Navigate} from "react-router-dom";

type ProtectedRouteLoginProps = {
    element: JSX.Element;
}

function ProtectedRouteLogin({element}: ProtectedRouteLoginProps): JSX.Element {
    const isAuth: boolean = Cookie.get("auth_token") == null;
    return isAuth ? element : <Navigate to="/" replace/>;
    // return element;
}

export default ProtectedRouteLogin;
