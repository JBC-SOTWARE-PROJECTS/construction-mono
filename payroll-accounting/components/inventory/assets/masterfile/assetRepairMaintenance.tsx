import React from "react";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  AssetPreventiveMaintenance,
  AssetRepairMaintenance,
  AssetStatus,
  Assets,
  PreventiveScheduleType,
} from "@/graphql/gql/graphql";
import { useRouter } from "next/router";
import moment from "moment";

type IProps = {
  dataSource: AssetRepairMaintenance[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: AssetRepairMaintenance) => void;
  handleAssign: (record: AssetRepairMaintenance) => void;
  handleSupplier: (record: AssetRepairMaintenance) => void;
  changePage: (page: number) => void;
};

export default function AssetRepairMaintenanceTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  handleAssign,
  handleSupplier,
  changePage,
}: IProps) {
  const router = useRouter();
  const columns: ColumnsType<AssetRepairMaintenance> = [
    {
      title: "Classification",
      dataIndex: "serviceClassification",
      key: "serviceClassification",
      width: "10%",
    //  render: (_, record) => <span>{record?.serviceClassification}</span>,
    }, 
    {
      title: "Description",
      dataIndex: "workDescription",
      key: "workDescription",
      width: "30%",
    },
    {
      title: "Type",
      dataIndex: "serviceType",
      key: "serviceType",
      width: "25%",
      render: (_, record) => <span>{record?.serviceType?.replace(/_/g, " ")}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "25%",
    }, 
    {
      title: "Action",
      dataIndex: "",
      key: "",
      width: "10%",
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
    },
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
