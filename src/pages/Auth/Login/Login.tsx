import * as React from "react";
import {JSX} from "react";
import style from "./Login.module.css";
import image_login_background from "../../../assets/images/login_background.svg";
import image_document from "../../../assets/images/document.svg";
import InputText from "../../../components/ui/InputText/InputText.tsx";
import ButtonSubmit from "../../../components/ui/ButtonSubmit/ButtonSubmit.tsx";
import Error from "../../../components/ui/Error/Error.tsx";
import {useForm} from "../../../hooks/useForm.ts";
import {useLogin} from "../../../hooks/useLogin.ts";

function Login(): JSX.Element {
    const {loginUser, errorMessage, isLoading} = useLogin();
    const {formItems, setFormItems, handleChange} = useForm({
        login: "",
        password: "",
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await loginUser(formItems);
        if (!isLoading) {
            if (!errorMessage) {
                setFormItems({
                    login: "",
                    password: "",
                });
            }
        }
    };

    return (
        <div className={style.container}>
            <form onSubmit={handleLogin} className={style.form}>
                {errorMessage ? <Error className={style.error}>{errorMessage}</Error> :
                    <div className={style.header}>Добро пожаловать!</div>}
                <InputText
                    type="text"
                    name="login"
                    value={formItems.login}
                    onChange={handleChange}
                    placeholder="Логин"
                    required
                    className={style.input}
                />
                <InputText
                    type="password"
                    name="password"
                    value={formItems.password}
                    onChange={handleChange}
                    placeholder="Пароль"
                    required
                    className={style.input}
                />
                <ButtonSubmit className={style.button} loading={isLoading}>Войти</ButtonSubmit>
                <img src={image_document} alt="" className={style.document_image_1}/>
                <img src={image_document} alt="" className={style.document_image_2}/>
            </form>
            <img src={image_login_background} alt="" className={style.image}/>
        </div>
    );
}

export default Login;
