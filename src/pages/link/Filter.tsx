import { Button, Form, Input } from "antd";
import _ from "lodash";
import { useEffect } from "react";
type Props = {
  open?: boolean;
  onSubmit: (values: Record<string, any>) => void;
};

export default function Filter({ open = true, onSubmit }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open]);

  return (
    <div>
      {open && (
        <Form form={form} layout="inline" onFinish={onSubmit}>
          <Form.Item name="id">
            <Input
              allowClear
              placeholder="ID"
              style={{ width: 100 }}
              className="mb-2"
            />
          </Form.Item>
          <Form.Item name="name">
            <Input
              allowClear
              placeholder="友链名称"
              style={{ width: 100 }}
              className="mb-2"
            />
          </Form.Item>
          <Form.Item name="url">
            <Input
              allowClear
              placeholder="链接地址"
              style={{ width: 100 }}
              className="mb-2"
            />
          </Form.Item>
          <Form.Item name="remark">
            <Input
              allowClear
              placeholder="备注"
              style={{ width: 100 }}
              className="mb-2"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              onClick={() => {
                form.resetFields();
                onSubmit({});
              }}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
