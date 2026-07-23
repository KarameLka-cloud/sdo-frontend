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
import {
  buildAdminLearningPath,
  buildLearningPath,
  isLearningCategory,
  isLearningType,
  LEARNING_CATEGORY_LABELS,
  LEARNING_TYPE_LABELS,
} from "@/constants/learning.ts";

function buildBreadcrumbs(pathname: string, search: string) {
  const params = new URLSearchParams(search);
  const category = params.get("category");
  const type = params.get("type");

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
  ];

  const special = specialRoutes.find((route) =>
    matchPath({ path: route.path, end: true }, pathname),
  );

  if (special) {
    return special.crumbs;
  }

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0 || segments[0] === "home") {
    return [{ label: "Главная" }];
  }

  if (segments[0] === "adaptation") {
    return [{ label: "Главная", href: ROUTES.HOME }, { label: "Адаптация" }];
  }

  if (segments[0] === "learning") {
    const crumbs: Array<{ label: string; href?: string }> = [
      { label: "Главная", href: ROUTES.HOME },
    ];

    if (isLearningCategory(category)) {
      crumbs.push({
        label: LEARNING_CATEGORY_LABELS[category],
        href: buildLearningPath(category, "event"),
      });
    }

    if (isLearningType(type)) {
      crumbs.push({ label: LEARNING_TYPE_LABELS[type] });
    }

    return crumbs;
  }

  if (segments[0] === "mentorship") {
    if (!segments[1]) {
      return [{ label: "Наставничество" }];
    }

    if (segments[1] === "interns") {
      return [
        { label: "Наставничество", href: ROUTES.MENTORSHIP },
        { label: "Стажеры" },
      ];
    }

    return [{ label: "Наставничество", href: ROUTES.MENTORSHIP }];
  }

  if (segments[0] === "admin") {
    if (!segments[1]) {
      return [{ label: "Администрирование" }];
    }

    if (segments[1] === "users") {
      return [
        { label: "Администрирование", href: ROUTES.ADMIN },
        { label: "Пользователи" },
      ];
    }

    if (segments[1] === "learning") {
      const crumbs: Array<{ label: string; href?: string }> = [
        { label: "Администрирование", href: ROUTES.ADMIN },
      ];

      if (isLearningCategory(category)) {
        crumbs.push({
          label: LEARNING_CATEGORY_LABELS[category],
          href: buildAdminLearningPath(category, "event"),
        });
      }

      if (isLearningType(type)) {
        crumbs.push({
          label: LEARNING_TYPE_LABELS[type],
          href: buildAdminLearningPath(
            isLearningCategory(category) ? category : "education",
            type,
          ),
        });
      }

      if (segments[2] === "create") {
        crumbs.push({ label: "Создание" });
      } else if (segments[2] && segments[3] === "edit") {
        crumbs.push({ label: "Редактирование" });
      }

      return crumbs;
    }

    if (segments[1] === "adaptation") {
      return [
        { label: "Администрирование", href: ROUTES.ADMIN },
        { label: "Планы адаптации" },
      ];
    }

    return [{ label: "Администрирование", href: ROUTES.ADMIN }];
  }

  return [{ label: "Главная", href: ROUTES.HOME }];
}

function BreadcrumbComponent(): JSX.Element {
  const location = useLocation();

  const crumbs = useMemo(
    () => buildBreadcrumbs(location.pathname, location.search),
    [location.pathname, location.search],
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
