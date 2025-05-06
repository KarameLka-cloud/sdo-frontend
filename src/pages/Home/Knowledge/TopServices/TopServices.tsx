import {JSX} from "react";
import style from "./TopServices.module.css";
import HeaderPage from "../../../../components/ui/HeaderPage/HeaderPage";

function TopServices(): JSX.Element {
    return (
        <>
            <HeaderPage className={style.header}>ТОП 25</HeaderPage>

            <h3 className={style.header_services}>Короткие услуги</h3>

            <div className={`${style.services} ${style.short_services}`}>
                <div className={style.service_content}>
                    <div className={style.service_group}>
                        <div className={style.service_group_name}>ЕСИА</div>
                        <ul className={style.service_link_list}>
                            <li>
                                <a className={style.service_link} href="#">Общее</a>
                            </li>
                        </ul>
                    </div>
                    <div className={style.service_group}>
                        <div className={style.service_group_name}>ЕПГУ</div>
                        <ul className={style.service_link_list}>
                            <li>
                                <a className={style.service_link} href="#">Выдача результатов</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={style.service_content}>
                    <div className={style.service_group}>
                        <div className={style.service_group_name}>МВД</div>
                        <ul className={style.service_link_list}>
                            <li>
                                <a
                                    className={style.service_link}
                                    href="https://sdo.prod.corp/mod/resource/view.php?id=4238&redirect=1"
                                    target="_blank"
                                >
                                    Справка о судимости
                                </a>
                            </li>
                            <li>
                                <a
                                    className={style.service_link}
                                    href="https://sdo.prod.corp/mod/resource/view.php?id=4239&redirect=1"
                                    target="_blank"
                                >
                                    Справка о наркот. сред-вах
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={style.service_content}>
                    <div className={style.service_group}>
                        <div className={style.service_group_name}>СФР</div>
                        <ul className={style.service_link_list}>
                            <li>
                                <a className={style.service_link} href="#">СНИЛС</a>
                            </li>
                            <li>
                                <a className={style.service_link} href="#">Справка о размере пенсии</a>
                            </li>
                            <li>
                                <a className={style.service_link} href="#">Сведение о труд. дея-ти</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <a
                href="#"
                className={`${style.services_test} ${style.short_services_test}`}
            >
                Тестирование по коротким услугам
            </a>

            <h3 className={style.header_services}>Средние услуги</h3>

            <div className={`${style.services} ${style.middle_service}`}>
                <div className={style.service_content}>
                    <div className={style.service_group}>
                        <div className={style.service_group_name}>МВД</div>
                        <ul className={style.service_link_list}>
                            <li>
                                <a className={style.service_link} href="#">Паспорт РФ</a>
                            </li>
                            <li>
                                <a
                                    className={style.service_link}
                                    href="https://sdo.prod.corp/mod/resource/view.php?id=4241&redirect=1"
                                    target="_blank"
                                >
                                    Регистрационный учёт
                                </a>
                            </li>
                            <li>
                                <a
                                    className={style.service_link}
                                    href="https://sdo.prod.corp/mod/resource/view.php?id=4242&redirect=1"
                                    target="_blank"
                                >
                                    Миграционный учёт
                                </a>
                            </li>
                            <li>
                                <a
                                    className={style.service_link}
                                    href="https://sdo.prod.corp/mod/resource/view.php?id=4240&redirect=1"
                                    target="_blank"
                                >
                                    ВУ
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={style.service_content}>
                    <div className={style.service_group}>
                        <div className={style.service_group_name}>ФНС</div>
                        <ul className={style.service_link_list}>
                            <li>
                                <a className={style.service_link} href="#">ИНН</a>
                            </li>
                        </ul>
                    </div>
                    <div className={style.service_group}>
                        <div className={style.service_group_name}>ФРС</div>
                        <ul className={style.service_link_list}>
                            <li>
                                <a className={style.service_link} href="#">Выписки из ЕГРН</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={style.service_content}>
                    <div className={style.service_group}>
                        <div className={style.service_group_name}>МСРОП</div>
                        <ul className={style.service_link_list}>
                            <li>
                                <a className={style.service_link} href="#">Решение ЕСПБ</a>
                            </li>
                            <li>
                                <a className={style.service_link} href="#">Выдача ЕСПБ</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <a
                href="#"
                className={`${style.services_test} ${style.middle_services_test}`}
            >
                Тестирование по средним услугам
            </a>

            <h3 className={style.header_services}>Длинные услуги</h3>

            <div className={`${style.services} ${style.long_service}`}>
                <div className={style.service_content}>
                    <div className={style.service_group}>
                        <div className={style.service_group_name}>МВД</div>
                        <ul className={style.service_link_list}>
                            <li>
                                <a className={style.service_link} href="#">Заграничный паспорт</a>
                            </li>
                        </ul>
                    </div>
                    <div className={style.service_group}>
                        <div className={style.service_group_name}>СФР</div>
                        <ul className={style.service_link_list}>
                            <li>
                                <a className={style.service_link} href="#">Единое пособие</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={style.service_content}>
                    <div className={style.service_group}>
                        <div className={style.service_group_name}>МСРОП</div>
                        <ul className={style.service_link_list}>
                            <li>
                                <a className={style.service_link} href="#">Отдельные меры социальной поддержки</a>
                            </li>
                            <li>
                                <a className={style.service_link} href="#">Пособие на форму многодетным</a>
                            </li>
                            <li>
                                <a className={style.service_link} href="#">Субсидия ЖКХ</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={style.service_content}>
                    <div className={style.service_group}>
                        <div className={style.service_group_name}>ФРС</div>
                        <ul className={style.service_link_list}>
                            <li>
                                <a className={style.service_link} href="#">Кадровый учёт</a>
                            </li>
                            <li>
                                <a className={style.service_link} href="#">Регисрация права</a>
                            </li>
                            <li>
                                <a className={style.service_link} href="#">Единое окно</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <a
                href="#"
                className={`${style.services_test} ${style.long_services_test}`}
            >
                Тестирование по длинным услугам
            </a>
        </>
    );
}

export default TopServices;
