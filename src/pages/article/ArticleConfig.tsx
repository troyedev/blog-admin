import {
  Button,
  Drawer,
  Form,
  Input,
  message,
  Select,
  Upload,
  UploadProps,
} from "antd";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "react-query";
import { getTagList } from "../../services/tag";
import { createArticle, updateArticle } from "../../services/article";
import { getCategoryList } from "../../services/category";
import dayjs from "dayjs";
import _ from "lodash";
const { TextArea } = Input;

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const ArticleConfig = ({ visible, onClose, changeForm, formData }: any) => {
  console.log(formData)
  const navigate = useNavigate();


  const { mutate: create } = useMutation({
    mutationFn: (data: Article) => createArticle(data),
    onSuccess: () => {
      message.success("发布成功");
      navigate("/article_published");
    },
  });
  const { mutate: update } = useMutation({
    mutationFn: (data: Article) => updateArticle(data),
    onSuccess: () => {
      message.success("发布成功");
      navigate("/article_published");
    },
  });
  const { data: tags } = useQuery({
    queryKey: [getTagList.name],
    queryFn: () =>
      getTagList({ page_num: 1, page_size: 100 }).then((res) => res.list),
  });
  const { data: categorys } = useQuery({
    queryKey: [getCategoryList.name],
    queryFn: () =>
      getCategoryList({ page_num: 1, page_size: 100 }).then((res) => res.list),
  });
  // 上传封面
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(()=>{
    if(formData?.cover) {
      setImageUrl(formData.cover)
    }
  },[formData])

  const [form] = useForm();
  // 确认发布
  const onFinish = (value: any) => {
    const article = {
      ...formData,
      ...value,
      cover: imageUrl,
      published_at: dayjs(),
    };
    article?.id ? update(article) : create(article);
  };
  // 关闭
  const close = () => {
    form.resetFields();
    if (formData.cover) {
      setImageUrl(formData.cover);
    }
    onClose();
  };
  // 上传封面
  const changeUpload: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj as RcFile, () => {
        setUploading(false);
        setImageUrl(info.file.response.data);
      });
    }
  };
  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div>上传封面</div>
    </div>
  );

  return (
    <Drawer
      title="发布文章"
      placement="right"
      onClose={close}
      open={visible}
      width={500}
    >
      <Form
        form={form}
        initialValues={formData}
        labelCol={{ span: 4 }}
        layout="horizontal"
        onValuesChange={changeForm}
        onFinish={onFinish}
      >
        <Form.Item label="分类" name="category_id" required>
          <Select
            optionLabelProp="label"
            placeholder="请选择分类"
            options={categorys?.map((item: Category) => ({
              value: item.id,
              label: item.name,
            }))}
          />
        </Form.Item>
        <Form.Item label="标签" name="tags">
          <Select
            mode="tags"
            optionLabelProp="label"
            placeholder="请选择标签"
            options={tags?.map((item: Tag) => ({
              value: item.id,
              label: item.name,
            }))}
          />
        </Form.Item>
        <Form.Item label="文章封面">
          <Upload
            name="file"
            listType="picture-card"
            showUploadList={false}
            action={`${import.meta.env.VITE_API_PROXY}/api/common/upload_file`}
            headers={{
              Authorization: localStorage.getItem("token") || "",
            }}
            onChange={changeUpload}
          >
            {imageUrl || formData.article_cover ? (
              <img
                src={imageUrl || formData.article_cover}
                alt=""
                style={{ width: "100%" }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item label="文章摘要" name="desc">
          <TextArea rows={4} maxLength={100} placeholder="请输入摘要内容" />
        </Form.Item>
        <Form.Item style={{ marginTop: "20px", float: "right" }}>
          <Button onClick={close}>取消</Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "200px", marginLeft: "20px" }}
          >
            确认发布
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ArticleConfig;
