import {JSX, SetStateAction, useState} from "react";
import {NavigateFunction, useNavigate} from "react-router-dom";
import style from "./Login.module.css";
import InputText from "../../../components/ui/InputText/InputText.tsx";
import InputError from "../../../components/ui/InputError/InputError.tsx";
import ButtonSubmit from "../../../components/ui/ButtonSubmit/ButtonSubmit.tsx";
import {login} from "../../../services/auth/login.ts";

function Login(): JSX.Element {
    const navigate: NavigateFunction = useNavigate();

    const [formData, setFormData] = useState({
        login: "",
        password: "",
    });

    const handleChange = (e: {
        target: { name: string; value: string };
    }): void => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const [error, setError] = useState(""); //\u200B

    function handleError(error: SetStateAction<string>): void {
        setError(error);
    }

    const handleLogin: (e: {
        preventDefault: () => void;
    }) => Promise<void> = async (e: {
        preventDefault: () => void;
    }): Promise<void> => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const result: { success: boolean; message: string } = await login(formData);
        if (result.success) {
            navigate("/");
        } else {
            handleError(result.message);
        }
    };

    return (
        <div className={style.container}>
            <form onSubmit={handleLogin} className={style.form}>
                {error ? <InputError className={style.error}>{error}</InputError> :
                    <div className={style.header}>Добро пожаловать!</div>}
                <InputText
                    type="text"
                    name="login"
                    value={formData.login}
                    onChange={handleChange}
                    placeholder="Логин"
                    required
                    className={style.input}
                />
                <InputText
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Пароль"
                    required
                    className={style.input}
                />
                <ButtonSubmit className={style.button}>Войти</ButtonSubmit>
                <img src="/src/assets/images/document_image.svg" alt="" className={style.document_image_1}/>
                <img src="/src/assets/images/document_image.svg" alt="" className={style.document_image_2}/>
            </form>

            <img src="/src/assets/images/login_background.svg" alt="" className={style.image}/>

        </div>
    );
}

export default Login;
