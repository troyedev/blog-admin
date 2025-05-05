import { Button, Card, message } from "antd";
import classNames from "classnames";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  createTheme,
  deleteTheme,
  getThemeList,
  updateTheme,
} from "../../services/theme";
import { useAtom } from "jotai";
import { userInfoState } from "../../models/user";
import { updateUserInfo, whoami } from "../../services/user";
import { PlusOutlined } from "@ant-design/icons";
import AddTheme from "./AddTheme";

export default function Theme() {
  const [userInfo, setUserInfo] = useAtom(userInfoState);
  const [curTheme, setCurTheme] = useState<any>(null);
  const [addOpen, setAddOpen] = useState(false);

  const { refetch: resetUserInfo } = useQuery({
    queryKey: [whoami.name],
    queryFn: () => whoami(),
    onSuccess: (res) => {
      setUserInfo(res.user);
    },
  });

  const { data: themes, refetch } = useQuery({
    queryKey: [getThemeList.name],
    queryFn: () =>
      getThemeList({ page_num: 1, page_size: 100 }).then((res) => res.list),
  });
  const { mutate: create } = useMutation({
    mutationFn: (data: Theme) => createTheme(data),
    onSuccess: () => {
      setAddOpen(false);
      refetch();
      message.success("添加成功！");
    },
  });
  const { mutate: update } = useMutation({
    mutationFn: (data: Theme) => updateTheme(data),
    onSuccess: () => {
      setCurTheme(null);
      refetch();
      message.success("修改成功！");
      setAddOpen(false);
    },
  });
  const { mutate: remove } = useMutation({
    mutationFn: (id: React.Key) => deleteTheme(id),
    onSuccess: () => {
      setAddOpen(false);
      refetch();
      message.success("删除成功！");
    },
  });
  const { mutate: updateUser } = useMutation({
    mutationKey: [updateUserInfo.name],
    mutationFn: (userInfo: any) => updateUserInfo(userInfo),
    onSuccess: () => {
      resetUserInfo();
      refetch();
      message.success("修改成功");
    },
  });

  // 添加
  const onAddTheme = (data: Theme) => {
    if (curTheme) {
      update({
        ...data,
        collapsed: data?.collapsed ? 1 : 0,
        dark: data?.dark ? 1 : 0,
        full: data?.full ? 1 : 0,
      });
    } else {
      create({
        ...data,
        collapsed: data?.collapsed ? 1 : 0,
        dark: data?.dark ? 1 : 0,
        full: data?.full ? 1 : 0,
      });
    }
  };
  return (
    <Card className="w-[840px] mx-auto bg-neutral-200 dark:bg-neutral-900">
      <div className="flex flex-wrap">
        <div
          className={classNames(
            "relative group mb-3 mr-3 w-[100px] h-[100px] border border-solid border-gray-400 rounded-lg bg-gray-50 flex justify-center items-end cursor-pointer",
            {
              "shadow-[0_0_10px_0_#1677FF] ": 0 === userInfo?.theme_id,
            }
          )}
        >
          <div className="hidden group-hover:flex flex-col items-center justify-center absolute left-0 right-0 top-0 bottom-0 bg-[rgba(0,0,0,.2)] w-full h-full text-center text-white rounded-b-lg">
            <Button size="small" onClick={() => updateUser({ theme_id: 0 })}>
              应用
            </Button>
          </div>
          <div className="bg-[rgba(0,0,0,.4)] w-full text-center text-white rounded-b-lg">
            默认主题
          </div>
        </div>
        {themes &&
          themes.map((item: any) => (
            <div
              className={classNames(
                "relative group mb-3 mr-3 w-[100px] h-[100px] border border-solid border-gray-400 rounded-lg flex justify-center items-end cursor-pointer",
                {
                  "shadow-[0_0_10px_0_#1677FF] ":
                    item.id === userInfo?.theme_id,
                }
              )}
              style={{
                background: item.background?.includes("http")
                  ? `url(${item.background})`
                  : item.background,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="hidden group-hover:flex flex-col items-center justify-center absolute left-0 right-0 top-0 bottom-0 bg-[rgba(0,0,0,.2)] w-full h-full text-center text-white rounded-b-lg">
                <Button
                  size="small"
                  onClick={() => updateUser({ theme_id: item.id })}
                >
                  应用
                </Button>
                <Button
                  size="small"
                  className="mt-1"
                  onClick={() => {
                    setCurTheme(item);
                    setAddOpen(true);
                  }}
                >
                  编辑
                </Button>
                <Button
                  size="small"
                  className="mt-1"
                  danger
                  onClick={() => remove(item.id)}
                >
                  删除
                </Button>
              </div>
              <div className="bg-[rgba(0,0,0,.4)] w-full text-center text-white rounded-b-lg">
                {item.name}
              </div>
            </div>
          ))}
        <div
          className={classNames(
            "mr-3 w-[100px] h-[100px] border border-solid border-gray-400 rounded-lg bg-gray-50 flex justify-center items-end cursor-pointer"
          )}
        >
          <div
            className="flex justify-center items-center text-3xl rounded-lg bg-[rgba(0,0,0,.4)] w-full h-full text-center text-white rounded-b-lg"
            onClick={() => {
              setCurTheme(null);
              setAddOpen(true);
            }}
          >
            <PlusOutlined />
          </div>
        </div>
      </div>

      {/* 添加主题 */}
      <AddTheme
        open={addOpen}
        curTheme={curTheme}
        onClose={() => setAddOpen(false)}
        onSubmit={onAddTheme}
      />
    </Card>
  );
}
