import { Tabs, TabsProps } from "antd";
import Info from "./Info";
import Theme from "./Theme";

export default function Settings() {
  const items: TabsProps["items"] = [
    {
      key: "info",
      label: `个人资料`,
      children: <Info />,
    },
    {
      key: 'theme',
      label: `主题设置`,
      children: <Theme />,
    },
  ];
  return (
    <Tabs
      style={{ transform: "translateY(-10px)" }}
      defaultActiveKey="info"
      items={items}
    />
  );
}
