import axios from "axios";

// 获取OSS配置
export const getOssConfig = (): Promise<{
  host: string;
  bucket: string;
  policy: string;
  access_key: string;
  secret_key: string;
}> => axios.get("/api/common/query_oss_config");

// 上传文件
export const uploadFile = (data: FormData): Promise<string> =>
  axios.post("/api/common/upload_file", data);
