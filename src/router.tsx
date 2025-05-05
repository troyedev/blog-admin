import { Navigate, useRoutes } from "react-router-dom";
import Login from "./pages/login/Index";
import BaseLayout from "./components/BaseLayout";
import ArticlePublished from "./pages/article/ArticlePublished";
import ArticleDraft from "./pages/article/ArticleDraft";
import EditArticle from "./pages/article/EditArticle";
import ArticleDetail from "./pages/article/ArticleDetail";
import CategoryManage from "./pages/category/Index";
import TagManage from "./pages/tag/Index";
import LinkManage from "./pages/link/Index";
import MyCommentManage from "./pages/comment/Index";
import Settings from "./pages/settings";
const pageMap = [
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/article_published" />,
      },
      {
        path: "/article_published",
        element: <ArticlePublished />,
      },
      {
        path: "/article_draft",
        element: <ArticleDraft />,
      },
      {
        path: "/article_detail",
        element: <ArticleDetail />,
      },
      {
        path: "/category_manage",
        element: <CategoryManage />
      },
      {
        path: "/tag_manage",
        element: <TagManage />
      },
      {
        path: "/link_manage",
        element: <LinkManage />
      },
      {
        path: "/comment_manage",
        element: <MyCommentManage />
      },{
        path: "/settings",
        element: <Settings />
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/edit_article",
    element: <EditArticle />
  }
];

export default () => useRoutes(pageMap);
