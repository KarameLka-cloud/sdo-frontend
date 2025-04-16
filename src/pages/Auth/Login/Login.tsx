import { JSX, SetStateAction, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import InputText from "../../../components/ui/InputText/InputText.tsx";
import InputError from "../../../components/ui/InputError/InputError.tsx";
import ButtonSubmit from "../../../components/ui/ButtonSubmit/ButtonSubmit.tsx";
import { login } from "../../../services/auth.ts";

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

  const [error, setError] = useState("");

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
    <div className="h-screen flex justify-center items-center">
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center w-lg p-4 border border-gray-200 rounded-md shadow-md bg-gray-100"
      >
        <InputText
          type="text"
          name="login"
          value={formData.login}
          onChange={handleChange}
          placeholder="Логин"
          required
          className="w-full p-2.5 mb-2 shadow-sm"
        />
        <InputError className="w-full mb-2">{error}</InputError>
        <InputText
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Пароль"
          required
          className="w-full p-2.5 mb-4 shadow-sm"
        />
        <ButtonSubmit className="w-fit px-5 py-2.5">Войти</ButtonSubmit>
      </form>
    </div>
  );
}

export default Login;
