import React, { useState } from "react";
import { ProList } from "@ant-design/pro-components";
import { Avatar, Button, Empty, Progress, Tag } from "antd";
import { Projects } from "@/graphql/gql/graphql";
import { NumberFormater } from '../../../utility/helper';

interface IProps {
  dataSource?: Projects[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: Projects) => void;
  changePage: (page: number) => void;
}

export default function ProjectList({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  changePage,
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
            <Button key="3" type="primary">
              Refresh
            </Button>,
          ];
        }}
        metas={{
          title: {
            render: (_, record) => {
              return record?.description;
            },
          },
          description: {
            render: (_, record) => {
              return (
                <>
                  <p>{record?.location?.fullAddress}</p>
                  <p>Total Project Grant: <span className="text-green font-bold">{NumberFormater(record?.totals)}</span></p>
                </>
              );
            },
          },
          avatar: {
            render: (_, record) => {
              return <Avatar size={45} />;
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
                  <div>
                    Project Progress <Tag color="green">{record?.status}</Tag>
                  </div>
                  <Progress percent={80} />
                </div>
              </div>
            ),
          },
          actions: {
            render: () => {
              return [<a key="init">View Details</a>];
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
