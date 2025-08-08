import {JSX} from "react";
import style from "./Test.module.css";
import convertDate from "../../../utils/convertDate.ts";
// import icon_trash from "../../../assets/images/icons/trash.svg";
import {TestType} from "../../../types/components/TestType.ts";

type TestProps = {
    className?: string;
    test: TestType;
}

function Test({className, test}: TestProps): JSX.Element {
    // const handleDeleteTest = async (id: number) => {
    //     const isDelete = confirm("Вы хотите удалить запись?");
    //     if (isDelete) {
    //         await mutation(id).unwrap();
    //     }
    // }

    return (
        <div className={`${style.test} + ${className}`} onClick={() => window.open(test.url, "_blank")}>
            <div className={style.content}>
                <div className={style.title}>{test.title}</div>
                {/*{mutation ? <div className={style.url}>{test.url}</div> : null}*/}
                <div className={style.date_end}>{`Пройти до ${convertDate(test.date_end)}г.`}</div>
            </div>
            {/*{*/}
            {/*    mutation ? (*/}
            {/*        <div onClick={() => handleDeleteTest(test.id)} className={style.delete_button}>*/}
            {/*            <img src={icon_trash} alt="Кнопка удалить"/>*/}
            {/*        </div>*/}
            {/*    ) : null*/}
            {/*}*/}
        </div>
    )
}

export default Test;
