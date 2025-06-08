import React from "react";
import { EyeOutlined, EditOutlined, PaperClipOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  AssetPreventiveMaintenance,
  AssetRepairMaintenance,
  AssetStatus,
  Assets,
  PreventiveScheduleType,
  VehicleUsageMonitoring,
} from "@/graphql/gql/graphql";
import { useRouter } from "next/router";
import moment from "moment";
import CustomButton from "@/components/common/CustomButton";

type IProps = {
  dataSource: VehicleUsageMonitoring[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: VehicleUsageMonitoring) => void;
  handleView: (record: VehicleUsageMonitoring) => void;
  handleSupplier: (record: VehicleUsageMonitoring) => void;
  handleAttachment: (record: VehicleUsageMonitoring) => void;
  changePage: (page: number) => void;
};

export default function VehicleUsageMonitoringProjectTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  handleView,
  handleSupplier,
  handleAttachment,
  changePage,
}: IProps) {
  const router = useRouter();

  const getHours = (startDate : any, endDate: any)=>{
    const startDateTime = moment(startDate);
    const endDateTime = moment(endDate);

    // Calculate the difference in milliseconds
    const durationInMillis = endDateTime.diff(startDateTime);

    // Convert milliseconds to hours
    const hours = moment.duration(durationInMillis).asHours();

    return Math.round(hours * 100) / 100;
  }


  const columns: ColumnsType<VehicleUsageMonitoring> = [
    {
    title: "Date",
    dataIndex: "date",
    key: "date",
    width: '1%',
    render: (_, record) => (
      <span>{moment(record?.startDatetime).format("ll") + " " + moment(record?.startDatetime).format('HH:mm:ss')}</span>
    ),
  },
  {
    title: "Usage Purpose",
    dataIndex: "usagePurpose",
    key: "usagePurpose",
    ellipsis: true,
    width: '1%',
  },
  {
    title: "Route",
    dataIndex: "route",
    key: "route",
    ellipsis: true,
    width: '1%',
  },
  {
    title: "Rental Fee",
    dataIndex: "calculatedRentalFee",
    key: "calculatedRentalFee",
    ellipsis: true,
    width: '1%',
    render: (_, record) => (
     <span>
      Php {Number(record?.calculatedRentalFee || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
    ),
  },
  {
    title: "Duration",
    dataIndex: "startDatetime",
    key: "startDatetime",
    ellipsis: true,
    width: '1%',
    render: (_, record) => (
      <span>{getHours(record?.startDatetime, record?.endDatetime) + " hr/s"}</span>
    ),
  },
  {
    title: "Odemeter Range",
    dataIndex: "startOdometerReading",
    key: "startOdometerReading",
    ellipsis: true,
    width: '1%',
    render: (_, record) => (
      <span>{record?.startOdometerReading + "-" + record?.endOdometerReading}</span>
    ),
  },
  {
    title: "Fuel Range",
    dataIndex: "startFuelReading",
    key: "startFuelReading",
    ellipsis: true,
    width: '1%',
    render: (_, record) => (
      <span>{record?.startFuelReading + "-" + record?.endFuelReading}</span>
    ),
  },
    // {
    //   title: "Project",
    //   dataIndex: "project",
    //   key: "project",
    //   render: (_, record) => (
    //     <span>{record?.project ? record?.project?.description : "Admin Purposes" }</span>
    //   ),
    // },
    // {
    //   title: "Action",
    //   dataIndex: "",
    //   key: "",
    //   width: "10%",
    //   fixed: "right",
    //   render: (_, record) => {
    //     return (
    //       <Row gutter={5}>
    //         <Col>
    //           <CustomButton
    //             icon={<EyeOutlined />}
    //             type="primary"
    //             onClick={() => {
    //               handleView(record);
    //             }}
    //             allowedPermissions={["manage_vehicle_usage", "view_vehicle_usage"]}
    //           />
    //         </Col>
    //         <Col>
    //           <CustomButton
    //             icon={<EditOutlined />}
    //             type="primary"
    //             onClick={() => {
    //               handleOpen(record);
    //             }}
    //             allowedPermissions={["manage_vehicle_usage", "update_vehicle_usage"]}
    //           />
    //         </Col>
    //         <Col>
    //           <CustomButton
    //             icon={<PaperClipOutlined />}
    //             type="primary"
    //             onClick={() => {
    //               handleAttachment(record);
    //             }}
    //             allowedPermissions={["manage_vehicle_usage"]}
    //           />
    //         </Col>
    //       </Row>
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
          scroll={{ x: 1400 }}
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
