import { Button, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import type { editor } from "monaco-editor";

import ReactMarkdown from "react-markdown"; // 解析 markdown
import remarkGfm from "remark-gfm"; // markdown 对表格/删除线/脚注等的支持

import ArticleConfig from "./ArticleConfig";
import { useLocation } from "react-router-dom";
import "./article.css";
import { RollbackOutlined } from "@ant-design/icons";
import { uploadFile } from "../../services/common";
import { useMutation } from "react-query";
import { createArticle, updateArticle } from "../../services/article";
import { useAtom } from "jotai";
import { isDarkState } from "../../models/system";
import _ from "lodash";

const editorOptions: editor.IStandaloneEditorConstructionOptions = {
  theme: "vs", // vs、vs-dark
  minimap: {
    enabled: false, // 展示小地图
  },
  automaticLayout: true, // 自适应布局
  overviewRulerBorder: false, // 是否应围绕概览标尺绘制边框
  renderLineHighlight: "none", // 突出行显示
  contextmenu: true, // 禁用右键菜单
  scrollBeyondLastLine: false, // 底部留空
  folding: true, // 是否启用代码折叠
  lineNumbers: "off", // 行号是否显示
  hideCursorInOverviewRuler: true, // 是否隐藏概览游标
  mouseWheelZoom: true, // 按住ctrl + 鼠标滚动 放大缩小
  scrollbar: {
    alwaysConsumeMouseWheel: false, // 滚动事件可冒泡至外层
  },
};

export default function EditArticle() {
  const [isDark] = useAtom(isDarkState);
  const location = useLocation();
  const navigate = useNavigate();

  const { mutate: create } = useMutation({
    mutationFn: (data: Article) => createArticle(data),
    onSuccess: () => {
      message.success("保存成功");
      navigate("/article_published");
    },
  });

  const { mutate: update } = useMutation({
    mutationFn: (data: Article) => updateArticle(data),
    onSuccess: () => {
      message.success("保存成功");
      navigate("/article_published");
    },
  });

  const [articleForm, setArticleForm] = useState<any>({
    title: "",
    content: "",
  });
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    if (location.state?.article) {
      const article = location.state.article;
      article.tags = _.map(article.tags, (v) => v?.id || v);
      setArticleForm(article);
    }
  }, []);
  // 发布文章
  const onPublish = () => {
    setShowConfig(true);
  };
  // 存入草稿箱
  const onDraft = () => {
    articleForm?.id
      ? update({ ...articleForm, published_at: null })
      : create({ ...articleForm, published_at: null });
  };
  // 关闭文章配置抽屉
  const closeConfig = () => {
    setShowConfig(false);
  };
  // 编辑器挂载完成
  const editorMounted = (editorInstance: editor.IStandaloneCodeEditor) => {
    const markdownBody = document.getElementsByClassName("markdown-body")[0];
    editorInstance.onDidScrollChange((e) => {
      const scale = e.scrollTop / e.scrollHeight;
      markdownBody.scrollTop =
        (markdownBody.scrollHeight + markdownBody.clientHeight) * scale;
    });
  };
  // 改变标题
  const changeTitle = (value: string) => {
    const newArticle = { ...articleForm };
    newArticle.title = value;
    setArticleForm(newArticle);
  };
  // 改变文章内容
  const changeContent = (value: any) => {
    const newArticle = { ...articleForm };
    newArticle.content = value;
    setArticleForm(newArticle);
  };
  // 插入图片
  const insertImage = () => {
    const upload: any = document.getElementById("upload");
    upload?.click();
    upload.onchange = async () => {
      const formData = new FormData();
      formData.append("file", upload.files[0]);
      const res = await uploadFile(formData);
      if (res) {
        const newArticle = { ...articleForm };
        newArticle.content += `![](${res})\n`;
        setArticleForm(newArticle);
      }
    };
  };
  // 插入表格
  const insertTable = () => {
    const newArticle = { ...articleForm };
    newArticle.content += `| 标题 |  |\n| --- | --- |\n|  |  |\n`;
    setArticleForm(newArticle);
  };
  // 插入标签
  const insertLink = () => {
    const newArticle = { ...articleForm };
    newArticle.content += `[](url)\n`;
    setArticleForm(newArticle);
  };
  // 插入加粗
  const insertBold = () => {
    const newArticle = { ...articleForm };
    newArticle.content += `****\n`;
    setArticleForm(newArticle);
  };
  // 插入标题
  const insertHeader = () => {
    const newArticle = { ...articleForm };
    newArticle.content += `# `;
    setArticleForm(newArticle);
  };
  // 插入斜体
  const insertItalic = () => {
    const newArticle = { ...articleForm };
    newArticle.content += `**`;
    setArticleForm(newArticle);
  };
  // 插入删除
  const insertDelete = () => {
    const newArticle = { ...articleForm };
    newArticle.content += `~~~~`;
    setArticleForm(newArticle);
  };
  // 插入代码
  const insertCode = () => {
    const newArticle = { ...articleForm };
    newArticle.content += "``";
    setArticleForm(newArticle);
  };
  // 插入代码块
  const insertCodeBlock = () => {
    const newArticle = { ...articleForm };
    newArticle.content += "\n```\n```\n";
    setArticleForm(newArticle);
  };
  return (
    <div className="edit-article dark:text-neutral-200 dark:bg-neutral-800">
      <input id="upload" type="file" style={{ display: "none" }} />
      <div className="header dark:bg-neutral-900">
        <Button
          onClick={() => navigate(-1)}
          icon={<RollbackOutlined />}
        ></Button>
        <Input
          placeholder="输入文章标题..."
          size="large"
          variant="borderless"
          value={articleForm.title}
          onChange={(e) => changeTitle(e.target.value)}
        />
        <Button onClick={onDraft}>草稿箱</Button>
        <Button
          type="primary"
          style={{ marginLeft: "10px" }}
          onClick={onPublish}
        >
          发布
        </Button>
      </div>
      <div className="nav">
        <i className="nav-sm iconfont icon-header1" onClick={insertHeader}></i>
        <i className="iconfont icon-cuti" onClick={insertBold}></i>
        <i className="iconfont icon-xieti" onClick={insertItalic}></i>
        <i className="iconfont icon-shanchuxian" onClick={insertDelete}></i>
        <i
          className="nav-lg iconfont icon-bianjilianjie"
          onClick={insertLink}
        ></i>
        <i
          className="nav-lg iconfont icon-bianjidaimashili"
          onClick={insertCode}
        ></i>
        <i
          className="nav-lg iconfont icon-HTMLyuanma"
          onClick={insertCodeBlock}
        ></i>
        <i className="nav-lg iconfont icon-biaoge" onClick={insertTable}></i>
        <i
          className="nav-lg iconfont icon-bianjitupian"
          onClick={insertImage}
        ></i>
        <i
          className="nav-lg iconfont icon-bianjimeiti"
          onClick={insertImage}
        ></i>
      </div>
      <div className="editor">
        <MonacoEditor
          height="calc(100vh-110px)"
          width="50%"
          className="markdown-editor dark:bg-neutral-800"
          value={articleForm.content}
          options={{ ...editorOptions, theme: isDark ? "vs-dark" : "vs" }}
          loading={<div>loading...</div>}
          language="markdown"
          onChange={changeContent}
          onMount={editorMounted}
        />
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {articleForm.content}
          </ReactMarkdown>
        </div>
      </div>
      <div className="config">
        <ArticleConfig
          formData={{ ...articleForm }}
          visible={showConfig}
          onClose={closeConfig}
        />
      </div>
    </div>
  );
}
