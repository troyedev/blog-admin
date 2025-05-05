import axios from "axios";

export const getTagList = (params: {
  page_num: number;
  page_size: number;
  id?: number;
  name?: string;
}): Promise<{ list: Tag[]; total: number }> =>
  axios.get("/api/tag/query_list", { params });

// 创建标签
export const createTag = (data: Tag) =>
  axios.post("/api/tag/create", data);

// 更新标签
export const updateTag = (data: Tag) =>
  axios.post("/api/tag/update", data);

// 删除标签
export const deleteTag = (id: React.Key) =>
  axios.post("/api/tag/delete", { id });
