import axios from "axios";

export const getArticleList = (params: {
  page_num: number;
  page_size: number;
  id?: number;
  title?: string;
  category?: number;
  tag?: number;
  published?: boolean;
}): Promise<{ list: Article[]; total: number }> =>
  axios.get("/api/article/query_list", { params });

// 创建文章
export const createArticle = (data: Article) =>
  axios.post("/api/article/create", data);

// 更新文章
export const updateArticle = (data: Article) =>
  axios.post("/api/article/update", data);

// 删除文章
export const deleteArticle = (id: React.Key) =>
  axios.post("/api/article/delete", { id });

// 发布文章
export const publishArticle = (id: React.Key) =>
  axios.patch("/article/publish", { id });