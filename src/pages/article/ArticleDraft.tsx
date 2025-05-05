import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Button, Image, Modal, Pagination, Table, Tag, message } from "antd";
import { ColumnsType } from "antd/es/table";
import _, { trim } from "lodash";
import Filter from "./Filter";
import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import BaseTableHeader from "../../components/BaseTableHeader";
import { deleteArticle, getArticleList } from "../../services/article";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

export default function ArticleDraft() {
  const navigate = useNavigate();

  const [openFilter, setOpenFilter] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [where, setWhere] = useState<Record<string, any>>({});

  const { data, isLoading, refetch } = useQuery({
    queryKey: [getArticleList.name, pageNum, pageSize, where],
    queryFn: () =>
      getArticleList({
        page_num: pageNum,
        page_size: pageSize,
        id: where?.id,
        title: where?.title,
        category: where?.category,
        tag: where?.tag,
        published: false,
      }),
  });

  const { mutate: remove, isLoading: removeLoading } = useMutation({
    mutationFn: (id: number) => deleteArticle(id),
    onSuccess: () => {
      message.success("删除成功");
      refetch();
    },
  });

  // 提交搜索表单
  const onSubmitFilter = useCallback((data: Record<string, any>) => {
    _.forOwn(data, (value: any, key: any) => {
      if (!trim(value)) {
        data[key] = undefined;
      }
    });
    setPageNum(1);
    setWhere({ ...data });
  }, []);

  const handleOpenFilter = (open: boolean) => {
    setOpenFilter(open);
    if (!open) {
      setPageNum(1);
      setWhere({});
    }
  };

  // 编辑文章
  const onEdit = (article: Article) => {
    navigate("/edit_article", { state: { article } });
  };
  // 删除提示框
  const handleDelete = (data: Article) => {
    Modal.confirm({
      title: "提示",
      content: `确定将【${data.title}】删除吗？`,
      okButtonProps: {
        loading: removeLoading,
      },
      onOk: () => remove(data.id),
    });
  };

  // table 列配置
  const columns = useMemo<ColumnsType<any>>(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        width: 70,
      },
      {
        title: "标题",
        dataIndex: "title",
        width: 100,
      },
      {
        title: "封面",
        dataIndex: "cover",
        width: 100,
        render: (value: string) => (
          <div>
            {value && (
              <Image
                src={value}
                width={40}
                height={40}
                className="object-cover"
              />
            )}
          </div>
        ),
      },
      {
        title: "描述",
        dataIndex: "desc",
      },
      {
        title: "分类",
        dataIndex: "category",
        width: 70,
        render: (value: Category) => <div>{value?.name}</div>,
      },
      {
        title: "标签",
        dataIndex: "tags",
        render: (value: Tag[]) => (
          <div>
            {value?.map((t) => (
              <Tag key={t.id}>{t.name}</Tag>
            ))}
          </div>
        ),
      },
      {
        title: "阅读数",
        dataIndex: "read",
        width: 70,
      },
      {
        title: "喜欢数",
        dataIndex: "like",
        width: 70,
      },
      {
        title: "创建人",
        dataIndex: "user_id",
        width: 70,
      },
      {
        title: "创建时间",
        dataIndex: "created_at",
        render: (value) => (
          <div>{value && dayjs(value).format("YYYY-MM-DD HH:mm:ss")}</div>
        ),
      },
      {
        title: "操作",
        dataIndex: "action",
        fixed: "right",
        width: 100,
        render: (_: any, record: any) => (
          <>
            <Button
              className="mr-1"
              type="primary"
              ghost
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                onEdit(record);
              }}
            />
            <Button
              className="mr-1"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <BaseTableHeader>
        <Button
          className="mr-2"
          ghost={openFilter}
          type={openFilter ? "primary" : "default"}
          icon={<FilterOutlined />}
          onClick={() => handleOpenFilter(!openFilter)}
        />
        <Button
          onClick={() => refetch()}
          icon={<ReloadOutlined />}
          className="mr-2"
        />
      </BaseTableHeader>
      <Filter open={openFilter} onSubmit={onSubmitFilter} />

      <Table
        scroll={{ y: "calc(100vh - 124px)" }}
        size="small"
        dataSource={data?.list}
        rowKey="id"
        loading={isLoading}
        columns={columns}
        pagination={false}
        footer={() => (
          <div className="flex justify-end">
            <Pagination
              showQuickJumper
              showSizeChanger
              hideOnSinglePage
              size="small"
              total={data?.total}
              current={pageNum}
              pageSize={pageSize}
              showTotal={(total) => `共 ${total} 条`}
              onChange={(page, size) => {
                setPageNum(page);
                setPageSize(size);
              }}
            />
          </div>
        )}
      />
    </div>
  );
}
