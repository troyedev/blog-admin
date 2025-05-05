// 登录用户信息
type LoginUser = {
  id: number;
  username: number;
  avatar: string;
  nickname: string;
  desc: string;
  email: string;
  about: string;
  theme_id: number;
};

// 权限页面信息
type RolePage = {
  id: number;
  name: string;
  path: string;
  class: string;
};
