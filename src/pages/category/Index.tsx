import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Button, Modal, Pagination, Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import _, { trim } from "lodash";
import Edit from "./Edit";
import Filter from "./Filter";
import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import BaseTableHeader from "../../components/BaseTableHeader";
import { deleteCategory, getCategoryList } from "../../services/category";
import dayjs from "dayjs";

export default function CategoryManage() {
  const [openFilter, setOpenFilter] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [where, setWhere] = useState<Record<string, any>>({});
  const [curRecord, setCurRecord] = useState<Category>();
  const [openEdit, setOpenEdit] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [getCategoryList.name, pageNum, pageSize, where],
    queryFn: () =>
      getCategoryList({
        page_num: pageNum,
        page_size: pageSize,
        id: where?.id,
        name: where?.name,
      }),
  });

  const { mutate: remove, isLoading: removeLoading } = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
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

  // 删除提示框
  const handleDelete = (data: Category) => {
    Modal.confirm({
      title: "提示",
      content: `确定将【${data.name}】删除吗？`,
      okButtonProps: {
        loading: removeLoading,
      },
      onOk: async () => {
        await remove(data.id);
      },
    });
  };

  // table 列配置
  const columns = useMemo<ColumnsType<any>>(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        width: 80,
      },
      {
        title: "分类名称",
        dataIndex: "name",
      },
      {
        title: "创建时间",
        dataIndex: "created_at",
        render: (value: string)=><div>{dayjs(value).format("YYYY-MM-DD HH:mm:ss")}</div>
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
                setCurRecord(record);
                setOpenEdit(true);
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
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => setOpenEdit(true)}
        >
          创建
        </Button>
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

      <Edit
        record={curRecord}
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setCurRecord(undefined);
          refetch();
        }}
      />
    </div>
  );
}
