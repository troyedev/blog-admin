import { Button, Form, Input, Select } from "antd";
import _ from "lodash";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { getCategoryList } from "../../services/category";
import { getTagList } from "../../services/tag";
type Props = {
  open?: boolean;
  onSubmit: (values: Record<string, any>) => void;
};

export default function Filter({ open = true, onSubmit }: Props) {
  const [form] = Form.useForm();

  const { data: categorys } = useQuery({
    queryKey: [getCategoryList.name],
    queryFn: async () => {
      const data = await getCategoryList({ page_num: 1, page_size: 100 });
      return _.map(data?.list, (v) => ({ label: v.name, value: v.id }));
    },
  });

  const { data: tags } = useQuery({
    queryKey: [getTagList.name],
    queryFn: async () => {
      const data = await getTagList({ page_num: 1, page_size: 100 });
      return _.map(data?.list, (v) => ({ label: v.name, value: v.id }));
    },
  });

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
          <Form.Item name="title">
            <Input
              allowClear
              placeholder="标题"
              style={{ width: 100 }}
              className="mb-2"
            />
          </Form.Item>
          <Form.Item name="category">
            <Select
              options={categorys}
              allowClear
              placeholder="分类"
              style={{ width: 100 }}
              className="mb-2"
            />
          </Form.Item>
          <Form.Item name="tag">
            <Select
              options={tags}
              allowClear
              placeholder="标签"
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
