import React, { JSX, useMemo } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { ROUTES } from "@/constants/routes";

const segmentLabels: Record<string, string> = {
  home: "Главная",
  adaptation: "Адаптация",
  education: "Обучение",
  edo: "ЭДО",
  mentorship: "Наставничество",
  admin: "Администрирование",
  courses: "Курсы",
  events: "Мероприятия",
  webinars: "Вебинары",
  tests: "Тесты",
  interns: "Стажеры",
  "my-interns": "Мои стажеры",
  templates: "Планы адаптации",
  edit: "Редактирование",
};

function buildBreadcrumbs(pathname: string) {
  const specialRoutes: Array<{
    path: string;
    crumbs: Array<{ label: string; href?: string }>;
  }> = [
    {
      path: ROUTES.MENTORSHIP_INTERNS_PLAN_EDIT,
      crumbs: [
        { label: "Главная", href: ROUTES.HOME },
        { label: "Наставничество", href: ROUTES.MENTORSHIP_INTERNS },
        { label: "Стажеры", href: ROUTES.MENTORSHIP_INTERNS },
        { label: "Редактирование плана адаптации стажера" },
      ],
    },
    {
      path: ROUTES.ADMIN_ADAPTATION_TEMPLATE_TASKS,
      crumbs: [
        { label: "Главная", href: ROUTES.HOME },
        { label: "Администрирование", href: ROUTES.ADMIN_USERS },
        { label: "Планы адаптации", href: ROUTES.ADMIN_ADAPTATION_TEMPLATES },
        { label: "Редактирование плана адаптации" },
      ],
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
      { label: "Обучение", href: ROUTES.EDUCATION_COURSES },
      { label: segmentLabels[secondSegment] ?? secondSegment },
    ];
  }

  if (firstSegment === "edo") {
    return [
      { label: "Главная", href: ROUTES.HOME },
      { label: "ЭДО", href: ROUTES.EDO_COURSES },
      { label: segmentLabels[secondSegment] ?? secondSegment },
    ];
  }

  if (firstSegment === "mentorship") {
    if (secondSegment === "interns" && thirdSegment === "edit") {
      return [
        { label: "Главная", href: ROUTES.HOME },
        { label: "Наставничество", href: ROUTES.MENTORSHIP_INTERNS },
        { label: "Стажеры", href: ROUTES.MENTORSHIP_INTERNS },
        { label: "Редактирование плана адаптации стажера" },
      ];
    }

    if (secondSegment === "interns") {
      return [
        { label: "Главная", href: ROUTES.HOME },
        { label: "Наставничество", href: ROUTES.MENTORSHIP_INTERNS },
        { label: "Стажеры" },
      ];
    }

    if (secondSegment === "my-interns") {
      return [
        { label: "Главная", href: ROUTES.HOME },
        { label: "Наставничество", href: ROUTES.MENTORSHIP_INTERNS },
        { label: "Мои стажеры" },
      ];
    }
  }

  if (firstSegment === "admin") {
    if (secondSegment === "users") {
      return [
        { label: "Главная", href: ROUTES.HOME },
        { label: "Администрирование", href: ROUTES.ADMIN_USERS },
        { label: "Пользователи" },
      ];
    }

    if (secondSegment === "education") {
      return [
        { label: "Главная", href: ROUTES.HOME },
        { label: "Администрирование", href: ROUTES.ADMIN_USERS },
        { label: "Обучение", href: ROUTES.ADMIN_EDUCATION_COURSE },
        { label: segmentLabels[thirdSegment] ?? thirdSegment },
      ];
    }

    if (secondSegment === "edo") {
      return [
        { label: "Главная", href: ROUTES.HOME },
        { label: "Администрирование", href: ROUTES.ADMIN_USERS },
        { label: "ЭДО", href: ROUTES.ADMIN_EDO_COURSES },
        { label: segmentLabels[thirdSegment] ?? thirdSegment },
      ];
    }

    if (secondSegment === "adaptation") {
      if (thirdSegment === "templates") {
        return [
          { label: "Главная", href: ROUTES.HOME },
          { label: "Администрирование", href: ROUTES.ADMIN_USERS },
          { label: "Планы адаптации" },
        ];
      }
    }
  }

  return crumbs;
}

function SidebarMain({ children }: { children: React.ReactNode }): JSX.Element {
  const location = useLocation();

  const crumbs = useMemo(
    () => buildBreadcrumbs(location.pathname),
    [location.pathname],
  );

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" />
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
                          <Link to={crumb.href}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {!isLast && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {children}
      {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
    </SidebarInset>
  );
}

export default SidebarMain;
