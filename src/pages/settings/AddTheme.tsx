import { PlusOutlined } from "@ant-design/icons";
import { Input, Form, Switch, Upload, Modal, Radio, ColorPicker } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { UploadFile, UploadProps } from "antd/lib";
import { RcFile } from "antd/lib/upload";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  curTheme: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
};
export default function AddTheme({ open, onClose, onSubmit, curTheme }: Props) {
  const [form] = Form.useForm();
  const [backgroundType, setBackgroundType] = useState("img");
  const [img, setImg] = useState("");
  useEffect(() => {
    if (curTheme && open) {
      form.setFieldsValue(curTheme);
      if (curTheme.background.includes("http")) {
        setImg(curTheme.background);
      }
    }
  }, [curTheme, open]);
  const changeUpload: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj as RcFile, () => {
        form.setFieldValue("background", info.file.response.data);
      });
      setImg(info.file.response.data);
    }
  };

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const onCancel = () => {
    form.resetFields();
    setBackgroundType("img");
    setImg("");
    onClose();
  };
  return (
    <Modal
      title={`${curTheme ? "编辑主题" : "添加主题"}`}
      width={400}
      open={open}
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <Form
        form={form}
        onFinish={(values) =>
          onSubmit({
            ...values,
            id: curTheme?.id || undefined,
            background:
              backgroundType === "color"
                ? values?.background.toHexString()
                : values?.background,
          })
        }
        labelCol={{ span: 6 }}
        style={{ marginTop: 20 }}
      >
        <Form.Item
          label="主题名称"
          name="name"
          rules={[{ required: true, message: "请输入主题名称" }]}
        >
          <Input placeholder="请输入主题名称" />
        </Form.Item>
        <Form.Item label="深色模式" name="dark">
          <Switch />
        </Form.Item>
        <Form.Item label="平铺布局" name="full">
          <Switch />
        </Form.Item>
        <Form.Item label="折叠导航" name="collapsed">
          <Switch />
        </Form.Item>
        <Form.Item label="背景类型">
          <Radio.Group
            value={backgroundType}
            options={[
              {
                label: "颜色",
                value: "color",
              },
              {
                label: "图片",
                value: "img",
              },
            ]}
            onChange={(e) => setBackgroundType(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="背景" name="background">
          {backgroundType === "color" ? (
            <ColorPicker />
          ) : (
            <Upload
              name="file"
              listType="picture-card"
              showUploadList={false}
              action={`${
                import.meta.env.VITE_API_PROXY
              }/api/common/upload_file`}
              headers={{
                Authorization: localStorage.getItem("token") || "",
              }}
              onChange={changeUpload}
            >
              {img ? (
                <img src={img} alt="" style={{ width: "100%" }} />
              ) : (
                <PlusOutlined />
              )}
            </Upload>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
}
