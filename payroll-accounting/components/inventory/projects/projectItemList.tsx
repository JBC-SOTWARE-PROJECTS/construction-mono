import React from "react";
import { ProList } from "@ant-design/pro-components";
import { Avatar, Button, Empty, Progress, Tag } from "antd";
import { Projects } from "@/graphql/gql/graphql";
import { NumberFormater, stringDateFull } from "../../../utility/helper";
import dayjs from "dayjs";

interface IProps {
  dataSource?: Projects[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: Projects) => void;
  changePage: (page: number) => void;
  onRefresh: () => void;
  handleOpenDetails: (record: Projects) => void;
}

export default function ProjectList({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  changePage,
  onRefresh,
  handleOpenDetails,
}: IProps) {
  return (
    <>
      <ProList<Projects>
        locale={{
          emptyText: <Empty description="No Project Available" />,
        }}
        style={{ minHeight: 500 }}
        toolBarRender={() => {
          return [
            <Button key="3" type="primary" onClick={onRefresh}>
              Refresh
            </Button>,
          ];
        }}
        metas={{
          title: {
            render: (_, record) => {
              return (
                <>
                  {record?.description}{" "}
                  <Tag color={record?.projectStatusColor ?? "default"}>
                    {record?.status}
                  </Tag>
                </>
              );
            },
          },
          description: {
            render: (_, record) => {
              return (
                <>
                  <p>{record?.location?.fullAddress} </p>
                  <p>
                    Project Started:{" "}
                    <span className="font-bold">
                      {stringDateFull(dayjs(record?.projectStarted))}
                    </span>
                  </p>
                  <p>
                    Total Project Grant:{" "}
                    <span className="text-green font-bold">
                      {NumberFormater(record?.totals)}
                    </span>
                  </p>
                </>
              );
            },
          },
          avatar: {
            render: (_, record) => {
              return (
                <Avatar
                  size={70}
                  style={{
                    backgroundColor: record?.projectColor ?? "",
                    verticalAlign: "middle",
                  }}>
                  {record?.prefixShortName}
                </Avatar>
              );
            },
          },
          content: {
            render: (_, record) => (
              <div
                style={{
                  minWidth: 200,
                  flex: 1,
                  display: "flex",
                  justifyContent: "flex-end",
                }}>
                <div
                  style={{
                    width: "200px",
                  }}>
                  <div className="font-bold">Project Progress</div>
                  <Progress percent={record?.projectPercent ?? 0} />
                </div>
              </div>
            ),
          },
          actions: {
            render: (_, record) => {
              return (
                <div className="flex-column">
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => handleOpen(record)}>
                    Project Information
                  </Button>
                  <Button
                    size="small"
                    type="dashed"
                    onClick={() => handleOpenDetails(record)}>
                    View Project Details
                  </Button>
                </div>
              );
            },
          },
        }}
        loading={loading}
        rowKey="title"
        dataSource={dataSource}
        pagination={{
          defaultPageSize: 10,
          onChange: (page) => {
            changePage(page - 1);
          },
          responsive: true,
          total: totalElements,
          showSizeChanger: false,
          showTotal(total, range) {
            return `Showing result ${range[0]} - ${range[1]} / Total records of ${total}`;
          },
        }}
      />
    </>
  );
}
