import { useAtom } from "jotai";
import { isDarkState } from "../../models/system";
import logoLight from "@/assets/logo_light.jpg";
import logoDark from "@/assets/logo_dark.jpg";
import { Button, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import { useMutation } from "react-query";
import { loginByAccount } from "../../services/user";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [isDark] = useAtom(isDarkState);
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const changeForm = useCallback((key: string, value: string) => {
    setLoginForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const { mutate: login } = useMutation({
    mutationKey: ["loginByAccount"],
    mutationFn: () => loginByAccount(loginForm),
    onSuccess: (res) => {
      localStorage.setItem("token", res.token);
      navigate("/");
    },
  });
  return (
    <div className="flex justify-center items-center h-screen overflow-hidden bg-white dark:bg-nuetral-900 dark:text-white">
      <div className="translate-y-[-30%] flex flex-col justify-center items-center">
        <img
          src={isDark ? logoDark : logoLight}
          alt="logo"
          className="w-[200px]"
        />
        <Input
          className="mt-6"
          size="large"
          placeholder="account"
          prefix={<UserOutlined />}
          value={loginForm.username}
          onChange={(e) => changeForm("username", e.target.value)}
        />

        <Input
          className="mt-3 w-[260px]"
          type="password"
          size="large"
          placeholder="password"
          prefix={<LockOutlined />}
          value={loginForm.password}
          onChange={(e) => changeForm("password", e.target.value)}
        />

        <Button
          className="mt-3 w-full"
          size="large"
          type="primary"
          onClick={() => login()}
        >
          登录
        </Button>
      </div>
    </div>
  );
}
