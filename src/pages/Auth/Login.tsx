import { FormEvent, JSX, useEffect } from "react";
import image_login_background from "@/assets/images/login_background.svg";
import image_logo_mfc from "@/assets/images/logo_mfc.svg";
import { useForm } from "@/hooks/useForm.ts";
import { useLogin } from "@/hooks/useLogin.ts";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/shadcn/field";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import { Spinner } from "@/components/ui/shadcn/spinner";
import { toast } from "sonner";

function Login(): JSX.Element {
  const { loginUser, errorMessage, isLoading } = useLogin();
  const { formItems, handleChange } = useForm({
    login: "",
    password: "",
  });

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void loginUser(formItems);
  };

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="grid p-0 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <img
                src={image_logo_mfc}
                alt="LogoLink"
                className="mx-auto h-12"
              />
              <h1 className="pt-4 text-2xl font-bold">
                Добро пожаловать в личный кабинет сотрудника!
              </h1>
            </div>
            <Field>
              <FieldLabel htmlFor="login">Логин</FieldLabel>
              <Input
                id="login"
                type="text"
                name="login"
                autoComplete="username"
                value={formItems.login}
                onChange={handleChange}
                placeholder="i.ivanov"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Пароль</FieldLabel>
              <Input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                value={formItems.password}
                onChange={handleChange}
                placeholder="********"
                required
              />
            </Field>
            <FieldSeparator />
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isLoading}
              variant={isLoading ? "outline" : "default"}
            >
              {isLoading && <Spinner data-icon="inline-start" />}
              {isLoading ? "Пожалуйста, подождите..." : "Войти"}
            </Button>
          </FieldGroup>
        </form>
        <div className="relative hidden bg-(--mfc-dark-color) md:block">
          <img
            src={image_login_background}
            alt="Image"
            className="absolute inset-0 m-auto h-full object-cover pt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default Login;
