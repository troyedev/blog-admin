import axios from "axios";

// 账号登录
export const loginByAccount = (
  data: LoginFormData
): Promise<{ token: string }> =>
  axios.post("/api/login/login_by_account", data);

// 登出
export const logout = () => axios.get("/api/login/logout");

// 获取当前用户信息
export const whoami = (): Promise<{
  user: LoginUser;
}> => axios.get("/api/user/whoami");

// 更新用户信息
export const updateUserInfo = (data: LoginUser) => axios.post("/api/user/update", data)