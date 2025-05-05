import { message } from "antd";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
// 请求拦截
axios.interceptors.request.use(
  (config) => {
    config.headers.Authorization = localStorage.getItem("token");
    return config;
  },
  (error) => {
    message.error(error.message);
  }
);

// 响应拦截
axios.interceptors.response.use(
  (res) => {
    const { data } = res;
    // 业务逻辑错误
    if (data.code !== 0) {
      message.error(data.msg);
      throw new Error(data.msg);
    }
    return data.data;
  },
  (error) => {
    message.error(error.msg);
    throw new Error(error.msg);
  }
);
