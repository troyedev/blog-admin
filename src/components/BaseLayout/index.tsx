import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Avatar, Layout, Menu, Switch } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { userInfoState } from "../../models/user";
import { useAtom } from "jotai";
import { collapsedState, isDarkState } from "../../models/system";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import { useQuery } from "react-query";
import { whoami } from "../../services/user";
import LeftMenu from "./LeftMenu";
const { Header, Content } = Layout;

export default function BaseLayout() {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useAtom(userInfoState);
  const [isDark, setIsDark] = useAtom(isDarkState);
  const [collapsed, setCollapsed] = useAtom(collapsedState);

  // 获取当前登录用户
  useQuery({
    queryKey: ["whoami"],
    queryFn: () => whoami(),
    onSuccess: (res) => {
      setUserInfo(res.user);
    },
    onError: () => {
      navigate("/login");
    },
  });

  // 登出
  // const { mutate: userLogout } = useMutation({
  //   mutationKey: ["logout"],
  //   mutationFn: () => logout(),
  //   onSuccess: () => {
  //     setUserInfo(undefined);
  //     localStorage.removeItem("userInfo");
  //     localStorage.removeItem("token");
  //     navigate("/login");
  //   },
  // });

  // 点击头部菜单
  const handleHeaderMenu = (info: MenuItemType) => {
    switch (info.key) {
      case "exit": {
        // userLogout();

        setUserInfo(undefined);
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        navigate("/login");
        break;
      }
    }
  };

  // 设置深色主题
  const setDark = (value: boolean) => {
    value
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
    setIsDark(value);
  };
  const HeaderMenu = [
    {
      label: (
        <>
          <span style={{ margin: "0 10px" }}>
            欢迎登录！{userInfo?.username}
          </span>
          <Avatar src={userInfo?.avatar} shape="square" size="default" />
        </>
      ),
      key: "info",
      children: [
        {
          label: "退出",
          key: "exit",
          icon: <WalletOutlined />,
        },
      ],
    },
  ];
  return (
    <Layout className="dark:text-neutral-200">
      <LeftMenu />

      <Layout className="relative h-[100vh] overflow-hidden">
        <Header
          className="flex justify-between p-0 pl-4 bg-white dark:bg-neutral-900"
          style={{
            borderBottom: "2px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            className="cursor-pointer"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          <div className="flex items-center h-full">
            <Switch
              checkedChildren={<i className="iconfont icon-moon_line" />}
              unCheckedChildren={<i className="iconfont icon-moon_line" />}
              value={isDark}
              onChange={(value) => setDark(value)}
            />
            <Menu
              className="h-full w-[200px]"
              items={HeaderMenu}
              mode="horizontal"
              onSelect={handleHeaderMenu}
            />
          </div>
        </Header>

        <Content className="p-2 bg-neutral-50 dark:bg-neutral-800">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
