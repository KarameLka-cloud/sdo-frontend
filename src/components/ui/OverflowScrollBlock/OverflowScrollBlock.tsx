import {JSX} from "react";
import styles from "./OverflowScrollBlock.module.css";
import HeaderPage from "@components/ui/HeaderPage/HeaderPage.tsx";

interface OverflowScrollBlockProps {
    header_name: string;
    button_back_visible?: 'enable' | 'disable';
    children?: JSX.Element | JSX.Element[];
}

function OverflowScrollBlock({
                                 children,
                                 button_back_visible = 'disable',
                                 header_name
                             }: OverflowScrollBlockProps): JSX.Element {
    return (
        <div className={styles.container}>
            <HeaderPage className={styles.header_page}
                        button_back_visible={button_back_visible}>{header_name}</HeaderPage>

            <div className={styles.main_content}>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default OverflowScrollBlock;
