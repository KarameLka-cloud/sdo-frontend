import {createBrowserRouter, Navigate} from "react-router-dom";
import {ProtectedRoute, ProtectedRouteAdmin} from "@components/protected/ProtectedRoutes.tsx";
import PageTitle from "@components/PageTitle.tsx";
import AuthLayout from "@layouts/AuthLayout/AuthLayout.tsx";
import DashboardLayout from "@layouts/DashboardLayout/DashboardLayout.tsx";
import HomeLayout from "@layouts/DashboardLayout/HomeLayout/HomeLayout.tsx";
import AdminLayout from "@layouts/DashboardLayout/AdminLayout/AdminLayout.tsx";
import Login from "@pages/Auth/Login/Login.tsx";
import Home from "@pages/Home/Home/Home.tsx";
import Career from "@pages/Home/Career/Career.tsx";
import Achievements from "@pages/Home/Achievements/Achievements.tsx";
import Knowledge from "@pages/Home/Knowledge/Knowledge.tsx";
import TopServices from "@pages/Home/Knowledge/TopServices/TopServices.tsx";
import Education from "@pages/Home/Education/Education.tsx";
import EducationCourses from "@pages/Home/Education/Courses/Courses.tsx";
import EducationEvents from "@pages/Home/Education/Events/Events.tsx";
import EducationWebinars from "@pages/Home/Education/Webinars/Webinars.tsx";
import EducationTests from "@pages/Home/Education/Tests/Tests.tsx";
import Edo from "@pages/Home/Edo/Edo.tsx";
import EdoCourses from "@pages/Home/Edo/Courses/Courses.tsx";
import EdoEvents from "@pages/Home/Edo/Events/Events.tsx";
import EdoTests from "@pages/Home/Edo/Tests/Tests.tsx";
import UsersAdmin from "@pages/Admin/Users/Users.tsx";
import KnowledgeAdmin from "@pages/Admin/Knowledge/Knowledge.tsx";
import EducationAdmin from "@pages/Admin/Education/Education.tsx";
import EducationCoursesAdmin from "@pages/Admin/Education/Courses/Courses.tsx";
import EducationEventsAdmin from "@pages/Admin/Education/Events/Events.tsx";
import EducationWebinarsAdmin from "@pages/Admin/Education/Webinars/Webinars.tsx";
import EducationTestsAdmin from "@pages/Admin/Education/Tests/Tests.tsx";
import EdoAdmin from "@pages/Admin/Edo/Edo.tsx";
import EdoCoursesAdmin from "@pages/Admin/Edo/Courses/Courses.tsx";
import EdoEventsAdmin from "@pages/Admin/Edo/Events/Events.tsx";
import EdoTestsAdmin from "@pages/Admin/Edo/Tests/Tests.tsx";
import {ROUTES} from "@constants/routes.ts";

const AppRoutes = createBrowserRouter([
    {
        path: ROUTES.ROOT,
        element: <Navigate to={ROUTES.HOME}/>,
    },
    {
        path: ROUTES.ADMIN,
        element: <Navigate to={ROUTES.ADMIN_USERS}/>,
    },
    {
        element: <ProtectedRoute elementLogin={<AuthLayout/>} route={"login"}/>,
        children: [
            {
                path: ROUTES.LOGIN,
                element: <PageTitle title={"Авторизация"} element={<Login/>}/>,
            },
        ],
    },
    {
        element: <ProtectedRoute elementDashboard={<DashboardLayout/>} route={"dashboard"}/>,
        children: [
            {
                element: <HomeLayout/>,
                children: [
                    {
                        path: ROUTES.HOME,
                        element: <PageTitle title={"Главная"} element={<Home/>}/>,
                    },
                    {
                        path: ROUTES.CAREER,
                        element: <PageTitle title={"Карьера"} element={<Career/>}/>,
                    },
                    {
                        path: ROUTES.ACHIEVEMENTS,
                        element: <PageTitle title={"Достижения"} element={<Achievements/>}/>,
                    },
                    {
                        path: ROUTES.KNOWLEDGE,
                        element: <PageTitle title={"База знаний"} element={<Knowledge/>}/>,
                    },
                    {
                        path: ROUTES.KNOWLEDGE_TOP,
                        element: <PageTitle title={"ТОП 25"} element={<TopServices/>}/>,
                    },
                    {
                        path: ROUTES.EDUCATION,
                        element: <PageTitle title={"Обучение"} element={<Education/>}/>,
                    },
                    {
                        path: ROUTES.EDUCATION_COURSES,
                        element: <PageTitle title={"Курсы"} element={<EducationCourses/>}/>,
                    },
                    {
                        path: ROUTES.EDUCATION_EVENTS,
                        element: <PageTitle title={"Мероприятия"} element={<EducationEvents/>}/>,
                    },
                    {
                        path: ROUTES.EDUCATION_WEBINARS,
                        element: <PageTitle title={"Вебинары"} element={<EducationWebinars/>}/>,
                    },
                    {
                        path: ROUTES.EDUCATION_TESTS,
                        element: <PageTitle title={"Тесты"} element={<EducationTests/>}/>,
                    },
                    {
                        path: ROUTES.EDO,
                        element: <PageTitle title={"ЕДО"} element={<Edo/>}/>,
                    },
                    {
                        path: ROUTES.EDO_COURSES,
                        element: <PageTitle title={"Курсы"} element={<EdoCourses/>}/>,

                    },
                    {
                        path: ROUTES.EDO_EVENTS,
                        element: <PageTitle title={"Мероприятия"} element={<EdoEvents/>}/>,
                    },
                    {
                        path: ROUTES.EDO_TESTS,
                        element: <PageTitle title={"Тесты"} element={<EdoTests/>}/>
                    },
                ]
            },
            {
                element: <ProtectedRouteAdmin elementAdmin={<AdminLayout/>}/>,
                children: [
                    {
                        path: ROUTES.ADMIN_USERS,
                        element: <PageTitle title={"Пользователи"} element={<UsersAdmin/>}/>,
                    },
                    {
                        path: ROUTES.ADMIN_KNOWLEDGE,
                        element: <PageTitle title={"База знаний"} element={<KnowledgeAdmin/>}/>,
                    },
                    {
                        path: ROUTES.ADMIN_EDUCATION,
                        element: <PageTitle title={"Обучение"} element={<EducationAdmin/>}/>,
                    },
                    {
                        path: ROUTES.ADMIN_EDUCATION_COURSE,
                        element: <PageTitle title={"Курсы"} element={<EducationCoursesAdmin/>}/>,
                    },
                    {
                        path: ROUTES.ADMIN_EDUCATION_EVENTS,
                        element: <PageTitle title={"Мероприятия"} element={<EducationEventsAdmin/>}/>,
                    },
                    {
                        path: ROUTES.ADMIN_EDUCATION_WEBINARS,
                        element: <PageTitle title={"Вебинары"} element={<EducationWebinarsAdmin/>}/>,
                    },
                    {
                        path: ROUTES.ADMIN_EDUCATION_TESTS,
                        element: <PageTitle title={"Тесты"} element={<EducationTestsAdmin/>}/>,
                    },
                    {
                        path: ROUTES.ADMIN_EDO,
                        element: <PageTitle title={"ЕДО"} element={<EdoAdmin/>}/>,
                    },
                    {
                        path: ROUTES.ADMIN_EDO_COURSES,
                        element: <PageTitle title={"Курсы"} element={<EdoCoursesAdmin/>}/>,
                    },
                    {
                        path: ROUTES.ADMIN_EDO_EVENTS,
                        element: <PageTitle title={"Мероприятия"} element={<EdoEventsAdmin/>}/>,
                    },
                    {
                        path: ROUTES.ADMIN_EDO_TESTS,
                        element: <PageTitle title={"Тесты"} element={<EdoTestsAdmin/>}/>,
                    },
                ]
            },
        ],
    },
]);

export default AppRoutes;
