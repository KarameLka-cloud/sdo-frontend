import { JSX } from "react";
import styles from "./Education.module.css";
import LinkService from "@components/ui/LinkService/LinkService.tsx";
import { ADMIN_NAV_EDUCATION_LINKS } from "@constants/navigation.ts";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";

function EducationEducation(): JSX.Element {
  return (
    <OverflowScrollBlock header_name={"Обучение"}>
      <div className={styles.links}>
        {ADMIN_NAV_EDUCATION_LINKS.map((link) => (
          <LinkService key={link.id} link={link} />
        ))}
      </div>
    </OverflowScrollBlock>
  );
}

export default EducationEducation;
