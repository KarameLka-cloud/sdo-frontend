import React, { JSX, useEffect } from "react";
import image_login_background from "@assets/images/login_background.svg";
import image_logo_mfc from "@assets/images/logo_mfc.svg";
import { useForm } from "@hooks/useForm.ts";
import { useLogin } from "@hooks/useLogin.ts";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

function Login(): JSX.Element {
  const { loginUser, errorMessage, isLoading } = useLogin();
  const { formItems, setFormItems, handleChange } = useForm({
    login: "",
    password: "",
  });

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage, {
        position: "top-center",
      });
    }
  }, [errorMessage]);

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
    <Card className="overflow-hidden p-0">
      <CardContent className="grid p-0 md:grid-cols-2">
        <form onSubmit={handleLogin} className="p-6 md:p-8">
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <img
                src={image_logo_mfc}
                alt="LogoLink"
                className="mx-auto h-12"
              />
              <h1 className="text-2xl font-bold pt-4">
                Добро пожаловать в личный кабинет сотрудника!
              </h1>
            </div>
            <Field>
              <FieldLabel htmlFor="login">Логин</FieldLabel>
              <Input
                type="text"
                name="login"
                value={formItems.login}
                onChange={handleChange}
                placeholder="i.ivanov"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Пароль</FieldLabel>
              <Input
                type="password"
                name="password"
                value={formItems.password}
                onChange={handleChange}
                placeholder="********"
                required
              />
            </Field>
            <FieldSeparator />
            {!isLoading ? (
              <Button type="submit" className="cursor-pointer">
                Войти
              </Button>
            ) : (
              <Button variant="outline" disabled>
                <Spinner data-icon="inline-start" />
                Пожалуйста, подождите...
              </Button>
            )}
          </FieldGroup>
        </form>
        <div className="relative hidden bg-[var(--mfc-dark-color)] md:block">
          <img
            src={image_login_background}
            alt="Image"
            className="absolute inset-0 h-full m-auto pt-2 object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default Login;
