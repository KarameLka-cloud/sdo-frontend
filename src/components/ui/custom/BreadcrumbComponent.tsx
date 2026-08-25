import React, { JSX, useMemo } from "react";
import { NavLink, matchPath, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/shadcn/breadcrumb";
import { ROUTES } from "@/constants/routes";
import {
  buildAdminLearningPath,
  buildLearningPath,
  isLearningCategory,
  isLearningType,
  LEARNING_CATEGORY_LABELS,
  LEARNING_TYPE_LABELS,
} from "@/constants/learning.ts";

type Crumb = { label: string; href?: string };

/** Подписи сегментов пути */
const SEGMENT_LABELS: Record<string, string> = {
  home: "Главная",
  adaptation: "Адаптация",
  mentorship: "Наставничество",
  interns: "Стажеры",
  services: "Дополнительные сервисы",
  employees: "Справочник сотрудника",
  admin: "Администрирование",
  users: "Пользователи",
  templates: "Планы адаптации",
  create: "Создание",
  edit: "Редактирование",
};

/**
 * Человекочитаемые заголовки для конечных страниц.
 * Цепочка до них собирается из URL автоматически.
 */
const LEAF_LABELS: Array<{ path: string; label: string }> = [
  {
    path: ROUTES.MENTORSHIP_INTERNS_PLAN_EDIT,
    label: "Редактирование плана адаптации стажера",
  },
  {
    path: ROUTES.ADMIN_ADAPTATION_TEMPLATE_TASKS,
    label: "Редактирование плана адаптации",
  },
  {
    path: ROUTES.ADMIN_LEARNING_CREATE,
    label: "Создание",
  },
  {
    path: ROUTES.ADMIN_LEARNING_EDIT,
    label: "Редактирование",
  },
];

const isId = (segment: string) => /^\d+$/.test(segment);

/** Сегменты-«прокладки», которые не показывают в крошках */
const shouldSkip = (segment: string, parent?: string) =>
  isId(segment) || (segment === "adaptation" && parent === "admin");

function getLeafLabel(pathname: string): string | undefined {
  return LEAF_LABELS.find((item) =>
    matchPath({ path: item.path, end: true }, pathname),
  )?.label;
}

function withoutLastHref(crumbs: Crumb[]): Crumb[] {
  if (crumbs.length === 0) {
    return [{ label: "Главная" }];
  }

  return crumbs.map((crumb, index) =>
    index === crumbs.length - 1 ? { label: crumb.label } : crumb,
  );
}

/** Learning: подписи берутся из ?category=&type= */
function buildLearningCrumbs(isAdmin: boolean, search: string): Crumb[] {
  const params = new URLSearchParams(search);
  const category = params.get("category");
  const type = params.get("type");

  const crumbs: Crumb[] = isAdmin
    ? [{ label: "Администрирование", href: ROUTES.ADMIN }]
    : [{ label: "Главная", href: ROUTES.HOME }];

  if (isLearningCategory(category)) {
    crumbs.push({
      label: LEARNING_CATEGORY_LABELS[category],
      href: isAdmin
        ? buildAdminLearningPath(category, "event")
        : buildLearningPath(category, "event"),
    });
  }

  if (isLearningType(type)) {
    crumbs.push({
      label: LEARNING_TYPE_LABELS[type],
      href: isAdmin
        ? buildAdminLearningPath(
            isLearningCategory(category) ? category : "education",
            type,
          )
        : undefined,
    });
  }

  return crumbs;
}

function buildBreadcrumbs(pathname: string, search: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0 || segments[0] === "home") {
    return [{ label: "Главная" }];
  }

  const isLearning =
    segments[0] === "learning" ||
    (segments[0] === "admin" && segments[1] === "learning");

  if (isLearning) {
    const crumbs = buildLearningCrumbs(segments[0] === "admin", search);
    const leaf = getLeafLabel(pathname);
    if (leaf) {
      crumbs.push({ label: leaf });
    }
    return withoutLastHref(crumbs);
  }

  const crumbs: Crumb[] = [];

  // Пользовательский раздел: адаптация начинается с «Главная»
  if (segments[0] === "adaptation") {
    crumbs.push({ label: "Главная", href: ROUTES.HOME });
  }

  let path = "";
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    path += `/${segment}`;

    if (shouldSkip(segment, segments[i - 1])) {
      continue;
    }

    // create / edit — подменяем на leaf-label, если есть
    if (segment === "create" || segment === "edit") {
      crumbs.push({
        label: getLeafLabel(pathname) ?? SEGMENT_LABELS[segment] ?? segment,
        href: path,
      });
      continue;
    }

    crumbs.push({
      label: SEGMENT_LABELS[segment] ?? segment,
      href: path,
    });
  }

  // Страницы вида /users/:id или /templates/:id — добавляем leaf в конец
  const leaf = getLeafLabel(pathname);
  const lastSegment = segments[segments.length - 1];
  if (leaf && isId(lastSegment)) {
    crumbs.push({ label: leaf });
  }

  return withoutLastHref(crumbs);
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
