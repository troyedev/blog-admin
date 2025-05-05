import Sider from "antd/es/layout/Sider";
import logoLight from "../../assets/logo_light.jpg";
import logoDark from "../../assets/logo_dark.jpg";
import classNames from "classnames";
import { useCallback, useMemo } from "react";
import { useAtom } from "jotai";
import { collapsedState, isDarkState } from "../../models/system";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

export default function LeftMenu() {
  const navigate = useNavigate();

  const [isDark] = useAtom(isDarkState);
  const [collapsed] = useAtom(collapsedState);

  const menuItems = useMemo(
    () => [
      {
        key: "/",
        label: "文章管理",
        children: [
          {
            label: "文章",
            key: "/article_published",
          },
          {
            label: "草稿箱",
            key: "/article_draft",
          },
        ],
      },
      {
        key: "/category_manage",
        label: "分类管理",
      },
      {
        key: "/tag_manage",
        label: "标签管理",
      },
      {
        key: "/link_manage",
        label: "友链管理",
      },
      {
        key: "/comment_manage",
        label: "评论管理",
      },
      {
        key: "/settings",
        label: "个人设置",
      },
    ],
    []
  );

  // 选中侧边栏后的事件
  const handleLeftMenu = useCallback((item: any) => {
    navigate(item.key);
  }, []);

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="h-screen bg-white dark:bg-neutral-900"
      style={{ boxShadow: "0 0 5px 0 rgba(0,0,0,.3)" }}
    >
      <div className="h-[64px] flex justify-center items-center">
        <img
          src={isDark ? logoDark : logoLight}
          alt="logo"
          className={classNames("transition-all", {
            "w-[160px]": !collapsed,
            "w-[70px]": collapsed,
          })}
        />
      </div>
      <Menu
        className="dark:bg-neutral-900"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onSelect={handleLeftMenu}
      />
    </Sider>
  );
}
