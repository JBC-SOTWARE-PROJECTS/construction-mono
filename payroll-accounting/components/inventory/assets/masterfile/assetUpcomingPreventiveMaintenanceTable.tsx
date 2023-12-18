import React from "react";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  AssetPreventiveMaintenance,
  AssetStatus,
  AssetUpcomingPreventiveMaintenance,
  Assets,
  PreventiveScheduleType,
} from "@/graphql/gql/graphql";
import DescLong from "../../desclong";
import { AssetStatusColor } from "@/utility/constant";
import { useRouter } from "next/router";
import moment from "moment";

type IProps = {
  dataSource: AssetUpcomingPreventiveMaintenance[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: AssetUpcomingPreventiveMaintenance) => void;
  handleAssign: (record: AssetUpcomingPreventiveMaintenance) => void;
  handleSupplier: (record: AssetUpcomingPreventiveMaintenance) => void;
  changePage: (page: number) => void;
};

export default function AssetUpcomingPreventiveMaintenanceTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  handleAssign,
  handleSupplier,
  changePage,
}: IProps) {
  const router = useRouter();
  const columns: ColumnsType<AssetUpcomingPreventiveMaintenance> = [
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
      title: "Occurrence Date",
      dataIndex: "occurrenceDate",
      key: "occurrence",
      width: 50,
      render: (_, record) => {
        return <>{moment(record?.occurrenceDate, "YYYY-MM-DD").format('MMM DD, YYYY') + (record?.scheduleType == PreventiveScheduleType.Daily ? " " +record?.occurrence + " " : " " )}</>
      },
    },
    {
      title: "Reminder Date",
      dataIndex: "reminderDate",
      key: "reminderDate",
      width: 50,
      render: (_, record) => {

        var orgDate = "";
        var convertedTime = "";

        if(record?.scheduleType == PreventiveScheduleType.Daily){
           orgDate = moment.utc(record?.reminderDate).format('HH:mm:ss');
           convertedTime = moment(orgDate, 'HH:mm:ss').format('hh:mm:ss A');
        }


        return <>{moment(record?.reminderDate, "YYYY-MM-DD").format('MMM DD, YYYY') + (record?.scheduleType == PreventiveScheduleType.Daily ? " " + convertedTime + " " : " " )}</>
      },
    },

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
