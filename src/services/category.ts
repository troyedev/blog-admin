import axios from "axios";

export const getCategoryList = (params: {
  page_num: number;
  page_size: number;
  id?: number;
  name?: string;
}): Promise<{ list: Category[]; total: number }> =>
  axios.get("/api/category/query_list", { params });

// 创建分类
export const createCategory = (data: Category) =>
  axios.post("/api/category/create", data);

// 更新分类
export const updateCategory = (data: Category) =>
  axios.post("/api/category/update", data);

// 删除分类
export const deleteCategory = (id: React.Key) =>
  axios.post("/api/category/delete", { id });
