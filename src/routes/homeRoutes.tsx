import { RouteObject } from "react-router-dom";
import PageTitle from "@components/PageTitle.tsx";
import HomeLayout from "@layouts/DashboardLayout/HomeLayout/HomeLayout.tsx";
import Home from "@pages/Home/Home/Home.tsx";
import Adaptation from "@pages/Home/Adaptation/Adaptation.tsx";
import Education from "@pages/Home/Education/Education.tsx";
import EducationCourses from "@pages/Home/Education/Courses/Courses.tsx";
import EducationEvents from "@pages/Home/Education/Events/Events.tsx";
import EducationWebinars from "@pages/Home/Education/Webinars/Webinars.tsx";
import EducationTests from "@pages/Home/Education/Tests/Tests.tsx";
import Edo from "@pages/Home/Edo/Edo.tsx";
import EdoCourses from "@pages/Home/Edo/Courses/Courses.tsx";
import EdoEvents from "@pages/Home/Edo/Events/Events.tsx";
import EdoTests from "@pages/Home/Edo/Tests/Tests.tsx";
import { ROUTES } from "@constants/routes.ts";

export const homeRoutes: RouteObject = {
  element: <HomeLayout />,
  children: [
    {
      path: ROUTES.HOME,
      element: <PageTitle title={"Главная"} element={<Home />} />,
    },
    {
      path: ROUTES.ADAPTATION,
      element: <PageTitle title={"Адаптация"} element={<Adaptation />} />,
    },
    {
      path: ROUTES.EDUCATION,
      element: <PageTitle title={"Обучение"} element={<Education />} />,
    },
    {
      path: ROUTES.EDUCATION_COURSES,
      element: <PageTitle title={"Курсы"} element={<EducationCourses />} />,
    },
    {
      path: ROUTES.EDUCATION_EVENTS,
      element: (
        <PageTitle title={"Мероприятия"} element={<EducationEvents />} />
      ),
    },
    {
      path: ROUTES.EDUCATION_WEBINARS,
      element: <PageTitle title={"Вебинары"} element={<EducationWebinars />} />,
    },
    {
      path: ROUTES.EDUCATION_TESTS,
      element: <PageTitle title={"Тесты"} element={<EducationTests />} />,
    },
    {
      path: ROUTES.EDO,
      element: <PageTitle title={"ЕДО"} element={<Edo />} />,
    },
    {
      path: ROUTES.EDO_COURSES,
      element: <PageTitle title={"Курсы"} element={<EdoCourses />} />,
    },
    {
      path: ROUTES.EDO_EVENTS,
      element: <PageTitle title={"Мероприятия"} element={<EdoEvents />} />,
    },
    {
      path: ROUTES.EDO_TESTS,
      element: <PageTitle title={"Тесты"} element={<EdoTests />} />,
    },
  ],
};
