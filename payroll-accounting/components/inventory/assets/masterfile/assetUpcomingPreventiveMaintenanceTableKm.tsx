import React from "react";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  AssetPreventiveMaintenance,
  AssetStatus,
  AssetUpcomingPreventiveMaintenance,
  AssetUpcomingPreventiveMaintenanceKms,
  Assets,
  PreventiveScheduleType,
} from "@/graphql/gql/graphql";
import DescLong from "../../desclong";
import { AssetStatusColor } from "@/utility/constant";
import { useRouter } from "next/router";
import moment from "moment";

type IProps = {
  dataSource: AssetUpcomingPreventiveMaintenanceKms[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: AssetUpcomingPreventiveMaintenanceKms) => void;
  handleAssign: (record: AssetUpcomingPreventiveMaintenanceKms) => void;
  handleSupplier: (record: AssetUpcomingPreventiveMaintenanceKms) => void;
  changePage: (page: number) => void;
};

export default function AssetUpcomingPreventiveMaintenanceKmTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  handleAssign,
  handleSupplier,
  changePage,
}: IProps) {
  const router = useRouter();
  const columns: ColumnsType<AssetUpcomingPreventiveMaintenanceKms> = [
    {
      title: "Asset",
      dataIndex: "asset.item.descLong",
      key: "asset.item.descLong",
      width: 100,
      render: (_, record) => <span>{record?.asset?.item?.descLong +"-"+ record?.asset?.model}</span>,
    },
    {
      title: "Maintenance Type",
      dataIndex: "assetMaintenanceType.name",
      key: "assetMaintenanceType",
      width: 80,
      render: (_, record) => <span>{record?.assetMaintenanceType?.name}</span>,
    },
    {
      title: "Schedule Type",
      dataIndex: "scheduleType",
      key: "scheduleType",
      width: 80,
    },
    {
      title: "Occurrence Km",
      dataIndex: "occurrence",
      key: "occurrence",
      width: 50,
      render: (_, record) => {
        return <>{record?.occurrence}</>
      },
    },
    {
      title: "Latest Usage",
      dataIndex: "latestUsage",
      key: "latestUsage",
      width: 50,
      render: (_, record) => {
        return <>{record?.latestUsage}</>
      },
    },
    {
      title: "Reminder Range",
      dataIndex: "occurrence",
      key: "occurrence",
      width: 50,
      render: (_, record) => {
        return <>{parseInt(record?.nextNearest ?? "0") -  parseInt(record?.reminderSchedule ?? "0")  + "-" + (parseInt(record?.nextNearest ?? "0") +  parseInt(record?.reminderSchedule ?? "0"))}</>
      },
    }

    // {
    //   title: "Action",
    //   dataIndex: "",
    //   key: "",
    //   width: 20,
    //   fixed: "right",
    //   render: (_, record) => {
    //     return (
    //       <Button
    //         icon={<EditOutlined />}
    //         type="primary"
    //         onClick={() => {
    //           handleOpen(record);
    //         }}
    //       />
    //     );
    //   },
    // },
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
