import React, { JSX, useMemo } from "react";
import { NavLink, matchPath, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ROUTES } from "@/constants/routes";

const segmentLabels: Record<string, string> = {
  home: "Главная",
  adaptation: "Адаптация",
  education: "Обучение",
  edo: "ЕДО",
  mentorship: "Наставничество",
  admin: "Администрирование",
  courses: "Курсы",
  events: "Мероприятия",
  webinars: "Вебинары",
  tests: "Тесты",
  interns: "Стажеры",
  templates: "Планы адаптации",
  edit: "Редактирование",
  create: "Создание",
};

function buildAdminResourceBreadcrumbs(
  domain: "education" | "edo",
  resource: "courses" | "events" | "tests" | "webinars",
  action: "create" | "edit",
) {
  const domainLabel = domain === "education" ? "Обучение" : "ЕДО";
  const domainListRoute =
    domain === "education"
      ? ROUTES.ADMIN_EDUCATION_EVENTS
      : ROUTES.ADMIN_EDO_EVENTS;
  const resourceLabels = {
    courses: "Курсы",
    events: "Мероприятия",
    tests: "Тесты",
    webinars: "Вебинары",
  };
  const resourceRoutes = {
    education: {
      courses: ROUTES.ADMIN_EDUCATION_COURSE,
      events: ROUTES.ADMIN_EDUCATION_EVENTS,
      tests: ROUTES.ADMIN_EDUCATION_TESTS,
      webinars: ROUTES.ADMIN_EDUCATION_WEBINARS,
    },
    edo: {
      courses: ROUTES.ADMIN_EDO_COURSES,
      events: ROUTES.ADMIN_EDO_EVENTS,
      tests: ROUTES.ADMIN_EDO_TESTS,
      webinars: ROUTES.ADMIN_EDUCATION_WEBINARS,
    },
  };
  const actionLabels = {
    create: {
      courses: "Создание курса",
      events: "Создание мероприятия",
      tests: "Создание теста",
      webinars: "Создание вебинара",
    },
    edit: {
      courses: "Редактирование курса",
      events: "Редактирование мероприятия",
      tests: "Редактирование теста",
      webinars: "Редактирование вебинара",
    },
  };

  return [
    { label: "Администрирование", href: ROUTES.ADMIN },
    { label: domainLabel, href: domainListRoute },
    {
      label: resourceLabels[resource],
      href: resourceRoutes[domain][resource],
    },
    { label: actionLabels[action][resource] },
  ];
}

function buildBreadcrumbs(pathname: string) {
  const specialRoutes: Array<{
    path: string;
    crumbs: Array<{ label: string; href?: string }>;
  }> = [
    {
      path: ROUTES.MENTORSHIP_INTERNS_PLAN_CREATE,
      crumbs: [
        { label: "Наставничество", href: ROUTES.MENTORSHIP },
        { label: "Стажеры", href: ROUTES.MENTORSHIP_INTERNS },
        { label: "Создание плана адаптации" },
      ],
    },
    {
      path: ROUTES.MENTORSHIP_INTERNS_PLAN_EDIT,
      crumbs: [
        { label: "Наставничество", href: ROUTES.MENTORSHIP },
        { label: "Стажеры", href: ROUTES.MENTORSHIP_INTERNS },
        { label: "Редактирование плана адаптации стажера" },
      ],
    },
    {
      path: ROUTES.ADMIN_ADAPTATION_TEMPLATES_CREATE,
      crumbs: [
        { label: "Администрирование", href: ROUTES.ADMIN },
        { label: "Планы адаптации", href: ROUTES.ADMIN_ADAPTATION_TEMPLATES },
        { label: "Создание плана адаптации" },
      ],
    },
    {
      path: ROUTES.ADMIN_ADAPTATION_TEMPLATE_TASKS,
      crumbs: [
        { label: "Администрирование", href: ROUTES.ADMIN },
        { label: "Планы адаптации", href: ROUTES.ADMIN_ADAPTATION_TEMPLATES },
        { label: "Редактирование плана адаптации" },
      ],
    },
    {
      path: ROUTES.ADMIN_USER_EDIT,
      crumbs: [
        { label: "Администрирование", href: ROUTES.ADMIN },
        { label: "Пользователи", href: ROUTES.ADMIN_USERS },
        { label: "Редактирование пользователя" },
      ],
    },
    {
      path: ROUTES.ADMIN_EDUCATION_COURSE_CREATE,
      crumbs: buildAdminResourceBreadcrumbs("education", "courses", "create"),
    },
    {
      path: ROUTES.ADMIN_EDUCATION_COURSE_EDIT,
      crumbs: buildAdminResourceBreadcrumbs("education", "courses", "edit"),
    },
    {
      path: ROUTES.ADMIN_EDUCATION_EVENTS_CREATE,
      crumbs: buildAdminResourceBreadcrumbs("education", "events", "create"),
    },
    {
      path: ROUTES.ADMIN_EDUCATION_EVENTS_EDIT,
      crumbs: buildAdminResourceBreadcrumbs("education", "events", "edit"),
    },
    {
      path: ROUTES.ADMIN_EDUCATION_TESTS_CREATE,
      crumbs: buildAdminResourceBreadcrumbs("education", "tests", "create"),
    },
    {
      path: ROUTES.ADMIN_EDUCATION_TESTS_EDIT,
      crumbs: buildAdminResourceBreadcrumbs("education", "tests", "edit"),
    },
    {
      path: ROUTES.ADMIN_EDUCATION_WEBINARS_CREATE,
      crumbs: buildAdminResourceBreadcrumbs("education", "webinars", "create"),
    },
    {
      path: ROUTES.ADMIN_EDUCATION_WEBINARS_EDIT,
      crumbs: buildAdminResourceBreadcrumbs("education", "webinars", "edit"),
    },
    {
      path: ROUTES.ADMIN_EDO_COURSES_CREATE,
      crumbs: buildAdminResourceBreadcrumbs("edo", "courses", "create"),
    },
    {
      path: ROUTES.ADMIN_EDO_COURSES_EDIT,
      crumbs: buildAdminResourceBreadcrumbs("edo", "courses", "edit"),
    },
    {
      path: ROUTES.ADMIN_EDO_EVENTS_CREATE,
      crumbs: buildAdminResourceBreadcrumbs("edo", "events", "create"),
    },
    {
      path: ROUTES.ADMIN_EDO_EVENTS_EDIT,
      crumbs: buildAdminResourceBreadcrumbs("edo", "events", "edit"),
    },
    {
      path: ROUTES.ADMIN_EDO_TESTS_CREATE,
      crumbs: buildAdminResourceBreadcrumbs("edo", "tests", "create"),
    },
    {
      path: ROUTES.ADMIN_EDO_TESTS_EDIT,
      crumbs: buildAdminResourceBreadcrumbs("edo", "tests", "edit"),
    },
  ];

  const special = specialRoutes.find((route) =>
    matchPath({ path: route.path, end: true }, pathname),
  );

  if (special) {
    return special.crumbs;
  }

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = [{ label: "Главная", href: ROUTES.HOME }];

  if (segments.length === 0) {
    return [{ label: "Главная" }];
  }

  const [firstSegment, secondSegment, thirdSegment] = segments;

  if (firstSegment === "home") {
    return [{ label: "Главная" }];
  }

  if (firstSegment === "adaptation") {
    return [{ label: "Главная", href: ROUTES.HOME }, { label: "Адаптация" }];
  }

  if (firstSegment === "education") {
    return [
      { label: "Главная", href: ROUTES.HOME },
      { label: "Обучение", href: ROUTES.EDUCATION_EVENTS },
      { label: segmentLabels[secondSegment] ?? secondSegment },
    ];
  }

  if (firstSegment === "edo") {
    return [
      { label: "Главная", href: ROUTES.HOME },
      { label: "ЕДО", href: ROUTES.EDO_EVENTS },
      { label: segmentLabels[secondSegment] ?? secondSegment },
    ];
  }

  if (firstSegment === "mentorship") {
    if (!secondSegment) {
      return [{ label: "Наставничество" }];
    }

    if (secondSegment === "interns" && thirdSegment === "edit") {
      return [
        { label: "Наставничество", href: ROUTES.MENTORSHIP },
        { label: "Стажеры", href: ROUTES.MENTORSHIP_INTERNS },
        { label: "Редактирование плана адаптации стажера" },
      ];
    }

    if (secondSegment === "interns") {
      return [
        { label: "Наставничество", href: ROUTES.MENTORSHIP },
        { label: "Стажеры" },
      ];
    }

    return [{ label: "Наставничество", href: ROUTES.MENTORSHIP }];
  }

  if (firstSegment === "admin") {
    if (!secondSegment) {
      return [{ label: "Администрирование" }];
    }

    if (secondSegment === "users") {
      return [
        { label: "Администрирование", href: ROUTES.ADMIN },
        { label: "Пользователи" },
      ];
    }

    if (secondSegment === "education") {
      return [
        { label: "Администрирование", href: ROUTES.ADMIN },
        { label: "Обучение", href: ROUTES.ADMIN_EDUCATION_EVENTS },
        { label: segmentLabels[thirdSegment] ?? thirdSegment },
      ];
    }

    if (secondSegment === "edo") {
      return [
        { label: "Администрирование", href: ROUTES.ADMIN },
        { label: "ЕДО", href: ROUTES.ADMIN_EDO_EVENTS },
        { label: segmentLabels[thirdSegment] ?? thirdSegment },
      ];
    }

    if (secondSegment === "adaptation") {
      if (thirdSegment === "templates") {
        return [
          { label: "Администрирование", href: ROUTES.ADMIN },
          { label: "Планы адаптации" },
        ];
      }
    }

    return [{ label: "Администрирование", href: ROUTES.ADMIN }];
  }

  return crumbs;
}

function BreadcrumbComponent(): JSX.Element {
  const location = useLocation();

  const crumbs = useMemo(
    () => buildBreadcrumbs(location.pathname),
    [location.pathname],
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <React.Fragment key={`${crumb.label}-${index}`}>
              <BreadcrumbItem
                className={!isLast ? "hidden md:block" : undefined}
              >
                {!isLast && crumb.href ? (
                  <BreadcrumbLink asChild>
                    <NavLink to={crumb.href}>{crumb.label}</NavLink>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadcrumbComponent;
