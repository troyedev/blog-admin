import { useCallback, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Button, Modal, Pagination, Switch, Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import _, { trim } from "lodash";
import Filter from "./Filter";
import {
  DeleteOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import BaseTableHeader from "../../components/BaseTableHeader";
import {
  auditComment,
  deleteComment,
  getCommentList,
} from "../../services/comment";
import dayjs from "dayjs";

export default function MyCommentManage() {
  const [openFilter, setOpenFilter] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [where, setWhere] = useState<Record<string, any>>({});

  const { data, isLoading, refetch } = useQuery({
    queryKey: [getCommentList.name, pageNum, pageSize, where],
    queryFn: () =>
      getCommentList({
        page_num: pageNum,
        page_size: pageSize,
        id: where?.id,
        name: where?.name,
        url: where?.url,
        remark: where?.remark,
      }),
  });

  const { mutate: remove, isLoading: removeLoading } = useMutation({
    mutationFn: (id: number) => deleteComment(id),
    onSuccess: () => {
      message.success("删除成功");
      refetch();
    },
  });

  const { mutate: audit } = useMutation({
    mutationFn: (data: { id: number; audit: number }) =>
      auditComment(data.id, data.audit),
    onSuccess: () => {
      message.success("处理成功");
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

  // 删除提示框
  const handleDelete = (data: MyComment) => {
    Modal.confirm({
      title: "提示",
      content: `确定将该评论删除吗？`,
      okButtonProps: {
        loading: removeLoading,
      },
      onOk: async () => {
        await remove(data.id);
      },
    });
  };

  // table 列配置
  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "评论内容",
      dataIndex: "content",
    },
    {
      title: "ip地址",
      dataIndex: "ip",
    },
    {
      title: "归属地",
      dataIndex: "remark",
      render: (_, comment) => (
        <span>
          {comment.province} {comment.city}
        </span>
      ),
    },
    {
      title: "父级评论",
      dataIndex: "comment_id",
      render: (value) => <div>{value ? value : ""}</div>,
    },
    {
      title: "审核状态",
      dataIndex: "examine",
      render: (_, comment) => (
        <Switch
          checked={comment.examine}
          onChange={(value) => {
            audit({ id: comment.id, audit: value ? 1 : 0 });
          }}
        />
      ),
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      render: (value: string) => (
        <div>{dayjs(value).format("YYYY-MM-DD HH:mm:ss")}</div>
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
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </>
      ),
    },
  ];

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
