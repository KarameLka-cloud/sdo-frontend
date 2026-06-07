import { JSX } from "react";
import { Outlet } from "react-router-dom";
import Nav from "@/components/home/Nav/Nav";
import Main from "@/components/home/Main/Main";
import { MENTOR_NAV_LINKS } from "@constants/navigation.ts";
import { useUser } from "@hooks/useUser.ts";
import { hasRole, USER_ROLES } from "@constants/roles.ts";
import { ROUTES } from "@constants/routes.ts";

function MentorshipLayout(): JSX.Element {
  const { role, role_name: roleName } = useUser();
  const isAdmin = hasRole(role, roleName, USER_ROLES.ADMIN);
  const isMentor = hasRole(role, roleName, USER_ROLES.MENTOR);
  const isDepartmentHead = hasRole(role, roleName, USER_ROLES.DEPARTMENT_HEAD);

  const mentorshipLinks = MENTOR_NAV_LINKS.filter((link) => {
    if (link.path === ROUTES.MENTORSHIP_INTERNS) {
      return isAdmin;
    }

    if (link.path === ROUTES.MENTORSHIP_MY_INTERNS) {
      return isMentor || isDepartmentHead;
    }

    return false;
  });

  return (
    <>
      <Nav links={mentorshipLinks} />
      <Main>
        <Outlet />
      </Main>
    </>
  );
}

export default MentorshipLayout;
