import { Form, Input, Modal, message } from "antd";
import _ from "lodash";
import { useMutation } from "react-query";
import { useCallback, useEffect } from "react";
import { createCategory, updateCategory } from "../../services/category";

type Props = {
  record: any;
  open: boolean;
  onClose: () => void;
};
export default function Edit({ open, record, onClose }: Props) {
  const [form] = Form.useForm();

  useEffect(() => record && form.setFieldsValue(record), [record]);

  const { mutate: create, isLoading: createLoading } = useMutation({
    mutationKey: [createCategory.name],
    mutationFn: (data: Category) => createCategory(data),
    onSuccess: () => {
      message.success("创建成功");
      onCancel();
    },
  });

  const { mutate: update, isLoading: updateLoading } = useMutation({
    mutationKey: [updateCategory.name],
    mutationFn: (data: any) => updateCategory(data),
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
      title={`${record ? "修改" : "创建"}分类`}
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
          <Form.Item label="分类名称" name="name" required>
            <Input placeholder="请输入分类名称" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
