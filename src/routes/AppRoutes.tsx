import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRouteLogin from "../components/protected/ProtectedRouteLogin.tsx";
import ProtectedRouteDashboard from "../components/protected/ProtectedRouteDashboard.tsx";
import PageTitle from "../components/PageTitle.tsx";
import AuthLayout from "../layouts/AuthLayout/AuthLayout.tsx";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout.tsx";
import Login from "../pages/Auth/Login/Login.tsx";
import Home from "../pages/Home/Home/Home.tsx";
import Career from "../pages/Home/Career/Career.tsx";
import Achievements from "../pages/Home/Achievements/Achievements.tsx";
import Interns from "../pages/Home/Interns/Interns.tsx";
import Knowledge from "../pages/Home/Knowledge/Knowledge.tsx";
import Education from "../pages/Home/Education/Education.tsx";
import Edo from "../pages/Home/Edo/Edo.tsx";
import TopServices from "../pages/Home/Knowledge/TopServices/TopServices.tsx";

const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="home" />,
  },
  {
    element: <ProtectedRouteLogin element={<AuthLayout />} />,
    children: [
      {
        path: "login",
        element: <PageTitle title={"Авторизация"} element={<Login />} />,
      },
    ],
  },
  {
    element: <ProtectedRouteDashboard element={<DashboardLayout />} />,
    children: [
      {
        path: "home",
        element: <PageTitle title={"Главная"} element={<Home />} />,
      },
      {
        path: "career",
        element: <PageTitle title={"Карьера"} element={<Career />} />,
      },
      {
        path: "achievements",
        element: <PageTitle title={"Мои достижения"} element={<Achievements />} />,
      },
      {
        path: "interns",
        element: <PageTitle title={"Мои стажеры"} element={<Interns />} />,
      },
      {
        path: "knowledge",
        element: <PageTitle title={"База знаний"} element={<Knowledge />} />,
      },
      {
        path: "knowledge/top",
        element: <PageTitle title={"База знаний"} element={<TopServices />} />,
      },
      {
        path: "education",
        element: <PageTitle title={"Мое обучение"} element={<Education />} />,
      },
      {
        path: "edo",
        element: <PageTitle title={"ЕДО"} element={<Edo />} />,
      },
    ],
  },
]);

export default AppRoutes;
