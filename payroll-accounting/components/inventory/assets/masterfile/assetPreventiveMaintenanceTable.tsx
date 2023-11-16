import React from "react";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { AssetPreventiveMaintenance, AssetStatus, Assets } from "@/graphql/gql/graphql";
import DescLong from "../../desclong";
import { AssetStatusColor } from "@/utility/constant";
import { useRouter } from "next/router";

type IProps = {
  dataSource: AssetPreventiveMaintenance[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: AssetPreventiveMaintenance) => void;
  handleAssign: (record: AssetPreventiveMaintenance) => void;
  handleSupplier: (record: AssetPreventiveMaintenance) => void;
  changePage: (page: number) => void;
};

export default function AssetPreventiveMaintenanceTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  handleAssign,
  handleSupplier,
  changePage,
}: IProps) {
  const router = useRouter();
  const columns: ColumnsType<AssetPreventiveMaintenance> = [
    {
      title: "Schedule Type",
      dataIndex: "scheduleType",
      key: "scheduleType",
      width: 100,
    },
    {
      title: "Occurrence",
      dataIndex: "occurrence",
      key: "occurrence",
      width: 100,
    },
    {
      title: "Reminder Schedule",
      dataIndex: "reminderSchedule",
      key: "reminderSchedule",
      width: 100,
    },
    {
      title: "Action",
      dataIndex: "",
      key: "",
      width: 30,
      fixed: "right",
      render: (_, record) => {
        return (
              <Button
                icon={<EditOutlined />}
                type="primary"
                onClick={() => {
                  handleOpen(record);
                }}
              />
           
        );
      },
    }
    
    
  ];

  return (
    <Row>
      <Col span={24}>
        <Table
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          loading={loading}
          footer={() => (
            <Pagination
              showSizeChanger={false}
              pageSize={10}
              responsive={true}
              total={totalElements}
                onChange={(e) => {
                  changePage(e - 1);
                }}
            />
          )}
          scroll={{ x: 1400 }}
        />
      </Col>
    </Row>
  );
}
