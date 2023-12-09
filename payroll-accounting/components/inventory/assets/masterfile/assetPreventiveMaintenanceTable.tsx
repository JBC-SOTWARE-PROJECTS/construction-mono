import React from "react";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  AssetPreventiveMaintenance,
  AssetStatus,
  Assets,
  PreventiveScheduleType,
} from "@/graphql/gql/graphql";
import DescLong from "../../desclong";
import { AssetStatusColor } from "@/utility/constant";
import { useRouter } from "next/router";
import moment from "moment";

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
      title: "Maintenance Type",
      dataIndex: "assetMaintenanceType.name",
      key: "assetMaintenanceType",
      width: 60,
      render: (_, record) => <span>{record?.assetMaintenanceType?.name}</span>,
    },
    {
      title: "Schedule Type",
      dataIndex: "scheduleType",
      key: "scheduleType",
      width: 50,
    },
    {
      title: "Occurrence",
      dataIndex: "occurrence",
      key: "occurrence",
      width: 50,
      render: (_, record) => {
        switch (record?.scheduleType) {
          case PreventiveScheduleType.Daily:
            return record?.occurrence + " Hr/s";
            break;
          case PreventiveScheduleType.Yearly:
            return <>{moment(record?.occurrence, "YYYY-MM-DD").format('MMM DD')}</>;
            break;

          default:
            return record?.occurrence;
            break;
        }
      },
    },
    {
      title: "Reminder Schedule (Before Occurence)",
      dataIndex: "reminderSchedule",
      key: "reminderSchedule",
      width: 100,
      render: (_, record) => {
        switch (record?.scheduleType) {
          case PreventiveScheduleType.Daily:
            return record?.reminderSchedule + " Hr/s";
            break;

          default:
            return record?.reminderSchedule + " Day/s";
            break;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "",
      width: 20,
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
        />
      </Col>
    </Row>
  );
}
