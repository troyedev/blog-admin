import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { UploadFile } from "antd/lib";
import { UploadChangeParam } from "antd/es/upload";
import { useCallback, useState } from "react";
import { RcFile } from "antd/lib/upload";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
};
export default function UploadImage({ value, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  // const { data: ossConfig } = useQuery({
  //   queryKey: [getOssConfig.name],
  //   queryFn: () => getOssConfig(),
  // });
  // console.log("ossconfig", ossConfig);

  const getBase64 = useCallback(
    (img: RcFile, callback: (url: string) => void) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => callback(reader.result as string));
      reader.readAsDataURL(img);
    },
    []
  );
  return (
    <Upload
      // name="file"
      // listType="picture-card"
      // showUploadList={false}
      // action={ossConfig?.host}
      // data={(file) => {
      //   file.fileName = `${uuidv4()}.${file.name.split(".").pop()}`;
      //   return {
      //     key: `${file.fileName}`,
      //     OSSAccessKeyId: ossConfig?.access_key,
      //     signature: ossConfig?.secret_key,
      //     policy: ossConfig?.policy,
      //     success_action_status: 200,
      //   };
      // }}
      name="file"
      listType="picture-card"
      showUploadList={false}
      action={`${import.meta.env.VITE_API_PROXY}/api/common/upload_file`}
      onChange={(info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === "uploading") {
          setLoading(true);
          return;
        }
        if (info.file.status === "done") {
          getBase64(info.file.originFileObj as RcFile, () => {
            setLoading(false);
            console.log(info);
            onChange && onChange(info.file.response.data);
          });
        }
      }}
    >
      {value ? (
        <img src={value} alt="" style={{ width: "100%" }} />
      ) : (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div>上传图片</div>
        </div>
      )}
    </Upload>
  );
}
