import {
  Avatar,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import MonacoEditor from "@monaco-editor/react";
import { useState } from "react";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { uploadFile } from "../../services/common";
import { useMutation, useQuery } from "react-query";
import { useAtom } from "jotai";
import { userInfoState } from "../../models/user";
import { updateUserInfo, whoami } from "../../services/user";

export default function Info() {
  const [form] = useForm();

  const [userInfo, setUserInfo] = useAtom(userInfoState);
  const [activeItem, setActiveItem] = useState<string>();

  const { refetch } = useQuery({
    queryKey: [whoami.name],
    queryFn: () => whoami(),
    onSuccess: (res) => {
      setUserInfo(res.user);
      form.setFieldsValue({ ...res.user });
    },
  });

  const { mutate: update } = useMutation({
    mutationFn: (userInfo: any) => updateUserInfo(userInfo),
    onSuccess: () => {
      refetch();
      setActiveItem("");
      message.success("修改成功");
    },
  });

  const changeAvatar = async () => {
    const a: any = document.createElement("input");
    a.setAttribute("type", "file");
    a.style.display = "none";
    document.body.appendChild(a);
    a.addEventListener("change", async () => {
      const file = a.files[0];
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadFile(formData);
      if (res) {
        update({ avatar: res });
      }
    });
    a.click();
  };
  // 打开关于文本框
  const [openAbout, setOpenAbout] = useState(false);
  return (
    <Card className="w-[840px] h-[calc(100vh-200px)] overflow-auto mx-auto bg-neutral-200 dark:bg-neutral-900">
      <Form form={form} labelCol={{ span: 4 }} labelAlign="left">
        <Row>
          <Col span={15}>
            <Form.Item name="account" label="账号" className="mb-0">
              <div className="text-base font-[300]">{userInfo?.username}</div>
            </Form.Item>
            <Divider className="m-2" />
            <Form.Item name="nickname" label="昵称" className="mb-0 group">
              {activeItem === "nickname" ? (
                <Input
                  placeholder="填写你的昵称"
                  autoFocus
                  onBlur={(e) => update({ nickname: e.target.value })}
                  suffix={<span className="cursor-pointer">保存</span>}
                />
              ) : (
                <div className=" flex justify-between text-base font-[300] ">
                  <span>{userInfo?.nickname}</span>
                  <span
                    className="hidden group-hover:block cursor-pointer"
                    onClick={() => setActiveItem("nickname")}
                  >
                    <EditOutlined />
                  </span>
                </div>
              )}
            </Form.Item>
            <Divider className="m-2" />
            <Form.Item name="desc" label="简介" className="mb-0 group">
              {activeItem === "desc" ? (
                <Input
                  placeholder="填写你的简介"
                  autoFocus
                  onBlur={(e) => update({ desc: e.target.value })}
                  suffix={<span className="cursor-pointer">保存</span>}
                />
              ) : (
                <div className=" flex justify-between text-base font-[300]">
                  <span>{userInfo?.desc}</span>
                  <span
                    className="hidden group-hover:block cursor-pointer"
                    onClick={() => setActiveItem("desc")}
                  >
                    <EditOutlined />
                  </span>
                </div>
              )}
            </Form.Item>
            <Divider className="m-2" />
            <Divider className="m-2" />
            <Form.Item name="password" label="密码" className="mb-0 group">
              {activeItem === "password" ? (
                <Input
                  placeholder="请输入新密码"
                  autoFocus
                  onBlur={(e) => update({ password: e.target.value })}
                  suffix={<span className="cursor-pointer">保存</span>}
                />
              ) : (
                <div className=" flex justify-between text-base font-[300]">
                  <span>************</span>
                  <span
                    className="hidden group-hover:block cursor-pointer"
                    onClick={() => setActiveItem("password")}
                  >
                    <EditOutlined />
                  </span>
                </div>
              )}
            </Form.Item>
          </Col>
          <Col span={5} offset={2}>
            <Form.Item name="avatar">
              <div className="text-center flex justify-center items-center flex-col ">
                <div className="w-[84px] h-[84px] group relative rounded-full overflow-hidden">
                  <div
                    className="cursor-pointer hidden group-hover:block absolute  w-full h-full text-[10px] text-white z-10 bg-[rgba(0,0,0,.5)] pt-5"
                    onClick={() => changeAvatar()}
                  >
                    <div>
                      <EditOutlined />
                    </div>
                    <div>点击修改头像</div>
                  </div>
                  <Avatar
                    size={84}
                    icon={<UserOutlined />}
                    src={userInfo?.avatar}
                  />
                </div>
                <div className="my-1">我的头像</div>
                <div className="text-[12px] text-gray-500">
                  支持 jpg、png、jpeg 格式大小 5M 以内的图片
                </div>
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Divider className="m-2" />
        <Form.Item name="about" className="group" labelCol={{ span: 3 }}>
          <span
            className="absolute top-2 right-2 hidden group-hover:block cursor-pointer"
            onClick={() => setOpenAbout(true)}
          >
            <EditOutlined />
          </span>
          {userInfo?.about ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {userInfo?.about}
            </ReactMarkdown>
          ) : (
            <h3>关于我</h3>
          )}
        </Form.Item>
        <Divider className="m-2" />
      </Form>
      <Modal
        okText="保存"
        open={openAbout}
        onCancel={() => setOpenAbout(false)}
        onOk={() => {
          update({ about: form.getFieldValue("about") });
          setOpenAbout(false);
        }}
        width={1200}
      >
        <MonacoEditor
          height="500px"
          width="100%"
          className="markdown-editor"
          value={userInfo?.about}
          onChange={(val) => form.setFieldValue("about", val)}
          options={{
            theme: "vs", // vs、vs-dark
            minimap: {
              enabled: false, // 展示小地图
            },
            automaticLayout: true, // 自适应布局
            overviewRulerBorder: false, // 是否应围绕概览标尺绘制边框
            renderLineHighlight: "none", // 突出行显示
            contextmenu: true, // 禁用右键菜单
            scrollBeyondLastLine: false, // 底部留空
            folding: true, // 是否启用代码折叠
            lineNumbers: "off", // 行号是否显示
            hideCursorInOverviewRuler: true, // 是否隐藏概览游标
            mouseWheelZoom: true, // 按住ctrl + 鼠标滚动 放大缩小
          }}
          loading={<div>loading...</div>}
          language="markdown"
        />
      </Modal>
    </Card>
  );
}
