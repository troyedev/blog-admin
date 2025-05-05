import { Form, Input, Modal, message } from "antd";
import _ from "lodash";
import { useMutation } from "react-query";
import { useCallback, useEffect } from "react";
import { createTag, updateTag } from "../../services/tag";

type Props = {
  record: any;
  open: boolean;
  onClose: () => void;
};
export default function Edit({ open, record, onClose }: Props) {
  const [form] = Form.useForm();

  useEffect(() => record && form.setFieldsValue(record), [record]);

  const { mutate: create, isLoading: createLoading } = useMutation({
    mutationKey: [createTag.name],
    mutationFn: (data: Tag) => createTag(data),
    onSuccess: () => {
      message.success("创建成功");
      onCancel();
    },
  });

  const { mutate: update, isLoading: updateLoading } = useMutation({
    mutationKey: [updateTag.name],
    mutationFn: (data: any) => updateTag(data),
    onSuccess: () => {
      message.success("修改成功");
      onCancel();
    },
  });
  const onSubmit = () => {
    if (record) {
      update({
        id: record.id,
        ...form.getFieldsValue(),
      });
    } else {
      create(form.getFieldsValue());
    }
  };
  const formatFuncs = useCallback(
    (items: any[], id: number = 0): any[] =>
      items
        .filter((v: any) => v.parent_id === id)
        .map((v: any) => {
          const children = formatFuncs(items, v.id);
          if (children.length) {
            v.children = children;
          }
          return v;
        }),
    []
  );

  const onCancel = () => {
    form.resetFields();
    onClose();
  };
  return (
    <Modal
      open={open}
      title={`${record ? "修改" : "创建"}标签`}
      onOk={() => form.submit()}
      onCancel={() => onCancel()}
      confirmLoading={record ? updateLoading : createLoading}
    >
      <div className="flex items-center">
        <Form
          className="w-full"
          form={form}
          onFinish={onSubmit}
          labelCol={{ span: 6 }}
        >
          <Form.Item label="标签名称" name="name" required>
            <Input placeholder="请输入标签名称" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
