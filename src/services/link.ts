import axios from "axios";

export const getLinkList = (params: {
  page_num: number;
  page_size: number;
  id?: number;
  name?: string;
  url?: string;
  remark?: string;
}): Promise<{ list: Link[]; total: number }> =>
  axios.get("/api/link/query_list", { params });

// 创建标签
export const createLink = (data: Link) =>
  axios.post("/api/link/create", data);

// 更新标签
export const updateLink = (data: Link) =>
  axios.post("/api/link/update", data);

// 删除标签
export const deleteLink = (id: React.Key) =>
  axios.post("/api/link/delete", { id });
