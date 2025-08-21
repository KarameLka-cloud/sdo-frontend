import * as React from "react";
import {JSX, useState} from "react";
import style from "./Login.module.css";
import {NavigateFunction, useNavigate} from "react-router-dom";
import Cookie from "js-cookie";
import image_login_background from "../../../assets/images/login_background.svg";
import image_document from "../../../assets/images/document.svg";
import InputText from "../../../components/ui/InputText/InputText.tsx";
import ButtonSubmit from "../../../components/ui/ButtonSubmit/ButtonSubmit.tsx";
import Error from "../../../components/ui/Error/Error.tsx";
import {useForm} from "../../../hooks/useForm.ts";
import {useLoginMutation} from "../../../services/store/features/auth.ts";

function Login(): JSX.Element {
    const navigate: NavigateFunction = useNavigate();
    const [login, {isLoading}] = useLoginMutation();
    const [error, setError] = useState("");
    const {formItems, setFormItems, handleChange} = useForm({
        login: "",
        password: "",
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await login(formItems).unwrap();
            Cookie.set("auth_token", result.auth_token);
            navigate("/");
        } catch (error: any) {
            setError(error.data.message);
        }
        setFormItems({
            login: "",
            password: "",
        });
    };

    return (
        <div className={style.container}>
            <form onSubmit={handleLogin} className={style.form}>
                {error ? <Error className={style.error}>{error}</Error> :
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
