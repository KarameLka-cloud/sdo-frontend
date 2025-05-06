import {JSX} from "react";
import Cookie from "js-cookie";
import {Navigate} from "react-router-dom";

type ProtectedRouteDashboardProps = {
    element: JSX.Element;
}

function ProtectedRouteDashboard({element}: ProtectedRouteDashboardProps): JSX.Element {
    const isAuth: boolean = Cookie.get("auth_token") == null;
    return isAuth ? <Navigate to="login" replace/> : element;
    // return element;
}

export default ProtectedRouteDashboard;
