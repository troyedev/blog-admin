import { PlusOutlined } from "@ant-design/icons";
import { Upload, UploadFile } from "antd";
import { UploadProps } from "antd/lib/upload";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { v4 as uuidv4 } from "uuid";
import { getOssConfig } from "../services/common";
import _ from "lodash";

type Props = {
  value?: string[];
  onChange?: (value: string[]) => void;
};

export default function ImageUpload({ value, onChange }: Props) {
  const { data: ossConfig } = useQuery({
    queryKey: [getOssConfig.name],
    queryFn: () => getOssConfig(),
  });
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 文件列表改变时，改变表单数据，改变文件列表
  const handleChange: UploadProps["onChange"] = (info) => {
    const newList = info.fileList.map((v) => {
      if (v.status === "done") {
        return {
          uid: v.uid,
          name: v.name,
          url: `http://course-blog.oss-cn-beijing.aliyuncs.com/${v.fileName}`,
          fileName: v.fileName,
        };
      }
      return v;
    });
    console.log("flist", info.fileList)
    const imgs = _.map(info.fileList, (i: any) =>
      i.fileName ? `http://course-blog.oss-cn-beijing.aliyuncs.com/${i.fileName}` : i.name
    );
    if (
      _.every(info.fileList, (i: any) =>
        i?.status ? i.status === "done" : true
      )
    ) {
      onChange?.(imgs);
    }
    setFileList(newList);
  };
  console.log(ossConfig)
  // 初始化value
  useEffect(() => {
    if (value) {
      setFileList(_.map(value, (i) => ({ uid: i, name: i, url: i })));
    }
  }, [value]);
  return (
    <>
      <Upload
        action={ossConfig?.host}
        name="file"
        accept="image/png, image/jpeg"
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
        data={(file) => {
          file.fileName = `${uuidv4()}.${file.name.split(".").pop()}`;
          return {
            dir: '/',
            key: `${file.fileName}`,
            OSSAccessKeyId: ossConfig?.access_key,
            signature: ossConfig?.secret_key,
            policy: ossConfig?.policy,
            success_action_status: 200,
          };
        }}
      >
        {fileList.length >= 1 ? null : (
          <div>
            <PlusOutlined />
          </div>
        )}
      </Upload>
    </>
  );
}
