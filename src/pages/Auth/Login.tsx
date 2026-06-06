import React, { JSX, useEffect } from "react";
import image_login_background from "@assets/images/login_background.svg";
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
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form onSubmit={handleLogin} className="p-6 md:p-8">
                <FieldGroup>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">
                      Добро пожаловать в личный кабинет сотрудника!
                    </h1>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="email">Логин</FieldLabel>
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
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Пароль</FieldLabel>
                    </div>
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
                  {/* <Field> */}
                  {!isLoading ? (
                    <Button type="submit" className="cursor-pointer">
                      Войти
                    </Button>
                  ) : (
                    <Button variant="outline" disabled size="sm">
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
        </div>
      </div>
    </div>
  );
}

export default Login;
