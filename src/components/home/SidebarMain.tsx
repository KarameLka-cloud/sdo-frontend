import React, { JSX, useMemo } from "react";
import { matchPath, NavLink, useLocation } from "react-router-dom";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
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
        { label: "Наставничество", href: ROUTES.MENTORSHIP },
        { label: "Стажеры", href: ROUTES.MENTORSHIP_INTERNS },
        { label: "Редактирование плана адаптации стажера" },
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

    if (secondSegment === "my-interns") {
      return [
        { label: "Наставничество", href: ROUTES.MENTORSHIP },
        { label: "Мои стажеры" },
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
        { label: "ЭДО", href: ROUTES.ADMIN_EDO_EVENTS },
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

function SidebarMain({ children }: { children: React.ReactNode }): JSX.Element {
  const location = useLocation();

  const crumbs = useMemo(
    () => buildBreadcrumbs(location.pathname),
    [location.pathname],
  );

  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-background">
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
                          <NavLink to={crumb.href}>{crumb.label}</NavLink>
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

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {children}
      </div>
    </SidebarInset>
  );
}

export default SidebarMain;
