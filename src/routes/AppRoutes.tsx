import {createBrowserRouter, Navigate} from "react-router-dom";
import ProtectedRouteLogin from "../components/protected/ProtectedRouteLogin.tsx";
import ProtectedRouteDashboard from "../components/protected/ProtectedRouteDashboard.tsx";
import PageTitle from "../components/PageTitle.tsx";
import AuthLayout from "../layouts/AuthLayout/AuthLayout.tsx";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout.tsx";
import HomeLayout from "../layouts/DashboardLayout/HomeLayout/HomeLayout.tsx";
import AdminLayout from "../layouts/DashboardLayout/AdminLayout/AdminLayout.tsx";
import Login from "../pages/Auth/Login/Login.tsx";
import Home from "../pages/Home/Home/Home.tsx";
import Career from "../pages/Home/Career/Career.tsx";
import Achievements from "../pages/Home/Achievements/Achievements.tsx";
import Interns from "../pages/Home/Interns/Interns.tsx";
import Knowledge from "../pages/Home/Knowledge/Knowledge.tsx";
import Education from "../pages/Home/Education/Education.tsx";
import Edo from "../pages/Home/Edo/Edo.tsx";
import TopServices from "../pages/Home/Knowledge/TopServices/TopServices.tsx";
import Events from "../pages/Home/Edo/Events/Events.tsx";
import UsersAdmin from "../pages/Admin/Users/Users.tsx";
import KnowledgeAdmin from "../pages/Admin/Knowledge/Knowledge.tsx";
import EducationAdmin from "../pages/Admin/Education/Education.tsx";
import EducationCoursesAdmin from "../pages/Admin/Education/Courses/Courses.tsx";
import EducationEventsAdmin from "../pages/Admin/Education/Events/Events.tsx";
import EducationWebinarsAdmin from "../pages/Admin/Education/Webinars/Webinars.tsx";
import EducationTestsAdmin from "../pages/Admin/Education/Tests/Tests.tsx";
import EdoAdmin from "../pages/Admin/Edo/Edo.tsx";
import EdoCoursesAdmin from "../pages/Admin/Edo/Courses/Courses.tsx";
import EdoEventsAdmin from "../pages/Admin/Edo/Events/Events.tsx";
import EdoTestsAdmin from "../pages/Admin/Edo/Tests/Tests.tsx";

const AppRoutes = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="user/home"/>,
    },
    {
        path: "user",
        element: <Navigate to="home"/>,
    },
    {
        path: "admin",
        element: <Navigate to="users"/>,
    },
    {
        element: <ProtectedRouteLogin element={<AuthLayout/>}/>,
        children: [
            {
                path: "login",
                element: <PageTitle title={"Авторизация"} element={<Login/>}/>,
            },
        ],
    },
    {
        element: <ProtectedRouteDashboard element={<DashboardLayout/>}/>,
        children: [
            {
                element: <HomeLayout/>,
                children: [
                    {
                        path: "user/home",
                        element: <PageTitle title={"Главная"} element={<Home/>}/>,
                    },
                    {
                        path: "user/career",
                        element: <PageTitle title={"Карьера"} element={<Career/>}/>,
                    },
                    {
                        path: "user/achievements",
                        element: <PageTitle title={"Достижения"} element={<Achievements/>}/>,
                    },
                    {
                        path: "user/interns",
                        element: <PageTitle title={"Стажеры"} element={<Interns/>}/>,
                    },
                    {
                        path: "user/knowledge",
                        element: <PageTitle title={"База знаний"} element={<Knowledge/>}/>,
                    },
                    {
                        path: "user/knowledge/top",
                        element: <PageTitle title={"ТОП 25"} element={<TopServices/>}/>,
                    },
                    {
                        path: "user/education",
                        element: <PageTitle title={"Обучение"} element={<Education/>}/>,
                    },
                    {
                        path: "user/edo",
                        element: <PageTitle title={"ЕДО"} element={<Edo/>}/>,
                    },
                    {
                        path: "user/edo/events",
                        element: <PageTitle title={"Мероприятия"} element={<Events/>}/>,
                    },
                ]
            },
            {
                element: <AdminLayout/>,
                children: [
                    {
                        path: "admin/users",
                        element: <PageTitle title={"Пользователи"} element={<UsersAdmin/>}/>,
                    },
                    {
                        path: "admin/knowledge",
                        element: <PageTitle title={"База знаний"} element={<KnowledgeAdmin/>}/>,
                    },
                    {
                        path: "admin/education",
                        element: <PageTitle title={"Обучение"} element={<EducationAdmin/>}/>,
                    },
                    {
                        path: "admin/education/courses",
                        element: <PageTitle title={""} element={<EducationCoursesAdmin/>}/>,
                    },
                    {
                        path: "admin/education/events",
                        element: <PageTitle title={""} element={<EducationEventsAdmin/>}/>,
                    },
                    {
                        path: "admin/education/webinars",
                        element: <PageTitle title={""} element={<EducationWebinarsAdmin/>}/>,
                    },
                    {
                        path: "admin/education/tests",
                        element: <PageTitle title={""} element={<EducationTestsAdmin/>}/>,
                    },
                    {
                        path: "admin/edo",
                        element: <PageTitle title={"ЕДО"} element={<EdoAdmin/>}/>,
                    },
                    {
                        path: "admin/edo/courses",
                        element: <PageTitle title={""} element={<EdoCoursesAdmin/>}/>,
                    },
                    {
                        path: "admin/edo/events",
                        element: <PageTitle title={""} element={<EdoEventsAdmin/>}/>,
                    },
                    {
                        path: "admin/edo/tests",
                        element: <PageTitle title={""} element={<EdoTestsAdmin/>}/>,
                    },
                ]
            },
        ],
    },
]);

export default AppRoutes;
