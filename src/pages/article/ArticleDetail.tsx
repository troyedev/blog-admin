import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";
import BaseTableHeader from "../../components/BaseTableHeader";

import ReactMarkdown from "react-markdown"; // 解析 markdown
import remarkGfm from "remark-gfm"; // markdown 对表格/删除线/脚注等的支持
import MarkdownNavbar from "markdown-navbar";
import { EditOutlined, RollbackOutlined } from "@ant-design/icons";
import "./article.css";

export default function ArticleDetail() {
  const [article, setArticle] = useState<Article>();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state?.article) {
      const article = location.state.article;
      setArticle(article);
    } else {
      navigate("/");
    }
  }, []);

  // 编辑文章
  const onEdit = () => {
    navigate("/edit_article", { state: { article } });
  };
  // 返回
  const onBack = () => {
    navigate(-1);
  };
  return (
    <div>
      <BaseTableHeader>
        <Button className="mr-2" icon={<EditOutlined />} onClick={onEdit} />
        <Button onClick={onBack} icon={<RollbackOutlined />} className="mr-2" />
      </BaseTableHeader>
      <div className="article-detail">
        <div className="mr-[220px] p-2 w-[calc(100%-220px)] h-[calc(100vh-80px)] overflow-auto dark:text-neutral-200">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article?.content || ""}
          </ReactMarkdown>
        </div>
        <div className="fixed top-[64px] right-[14px] w-[200px]">
          <h3>目录</h3>
          <MarkdownNavbar className="markdown-navbar" source={article?.content || ""} ordered={false} />
        </div>
      </div>
    </div>
  );
}
