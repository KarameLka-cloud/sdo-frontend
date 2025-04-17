import { JSX } from "react";
import Cookie from "js-cookie";
import { Navigate } from "react-router-dom";

function ProtectedRouteLogin({
  element,
}: {
  element: JSX.Element;
}): JSX.Element {
  // const isAuth: boolean = Cookie.get("auth_token") == null;
  // return isAuth ? element : <Navigate to="/" replace />;
  return element;
}

export default ProtectedRouteLogin;
