import axios from "axios";

export const getThemeList = (params: {
  page_num: number;
  page_size: number;
}): Promise<{ list: Theme[]; total: number }> =>
  axios.get("/api/theme/query_list", { params });

// 创建标签
export const createTheme = (data: Theme) =>
  axios.post("/api/theme/create", data);

// 更新标签
export const updateTheme = (data: Theme) =>
  axios.post("/api/theme/update", data);

// 删除标签
export const deleteTheme = (id: React.Key) =>
  axios.post("/api/theme/delete", { id });
