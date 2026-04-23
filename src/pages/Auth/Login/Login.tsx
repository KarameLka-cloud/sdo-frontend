import React from "react";
import { JSX } from "react";
import styles from "./Login.module.css";
import image_login_background from "@assets/images/login_background.svg";
import image_document from "@assets/images/document.svg";
import Input from "@components/ui/Input/Input.tsx";
import ButtonSubmit from "@components/ui/ButtonSubmit/ButtonSubmit.tsx";
import Error from "@components/ui/Error/Error.tsx";
import { useForm } from "@hooks/useForm.ts";
import { useLogin } from "@hooks/useLogin.ts";

function Login(): JSX.Element {
  const { loginUser, errorMessage, isLoading } = useLogin();
  const { formItems, setFormItems, handleChange } = useForm({
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
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.form}>
        {errorMessage ? (
          <Error className={styles.error}>{errorMessage}</Error>
        ) : (
          <div className={styles.header}>Добро пожаловать!</div>
        )}
        <Input
          type="text"
          name="login"
          value={formItems.login}
          onChange={handleChange}
          placeholder="Логин"
          required
          className={styles.input}
        />
        <Input
          type="password"
          name="password"
          value={formItems.password}
          onChange={handleChange}
          placeholder="Пароль"
          required
          className={styles.input}
        />
        <ButtonSubmit className={styles.button} loading={isLoading}>
          Войти
        </ButtonSubmit>
        <img src={image_document} alt="" className={styles.document_image_1} />
        <img src={image_document} alt="" className={styles.document_image_2} />
      </form>
      <img src={image_login_background} alt="" className={styles.image} />
    </div>
  );
}

export default Login;
