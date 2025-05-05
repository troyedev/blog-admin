import axios from "axios";

export const getCommentList = (params: {
  page_num: number;
  page_size: number;
  id?: number;
  name?: string;
  url?: string;
  remark?: string;
}): Promise<{ list: Comment[]; total: number }> =>
  axios.get("/api/comment/query_list", { params });

// 创建评论
export const createComment = (data: Comment) =>
  axios.post("/api/comment/create", data);

// 更新评论
export const updateComment = (data: Comment) =>
  axios.post("/api/comment/update", data);

// 删除评论
export const deleteComment = (id: React.Key) =>
  axios.post("/api/comment/delete", { id });

// 审核评论
export const auditComment = (id: React.Key, examine: number) =>
  axios.post("/api/comment/update", { id, examine });
