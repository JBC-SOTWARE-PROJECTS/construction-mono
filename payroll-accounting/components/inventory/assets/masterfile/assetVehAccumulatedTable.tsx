import React from "react";
import { EditOutlined } from "@ant-design/icons";
import { Row, Col, Table, Pagination,  Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { AssetVehicleUsageAccumulation, RentalRates } from "@/graphql/gql/graphql";
import { useRouter } from "next/router";
import moment from "moment";

type IProps = {
  dataSource: AssetVehicleUsageAccumulation[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: RentalRates) => void;
  changePage: (page: number) => void;
};

export default function AssetVehAccumulatedTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  changePage,
}: IProps) {
  const router = useRouter();
  const columns: ColumnsType<AssetVehicleUsageAccumulation> = [
    {
      title: "Date of Usage",
      dataIndex: "dateOfUsage",
      key: "dateOfUsage",
      width: 100,
      render: (_, record) => <span>{moment(record?.dateOfUsage).format("ll")  }</span>,

    },
    {
      title: "Total Odometer",
      dataIndex: "accumulatedOdo",
      key: "accumulatedOdo",
      width: 100,
    },
    {
      title: "Total Fuel",
      dataIndex: "accumulatedFuel",
      key: "accumulatedFuel",
      width: 100,
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
        />
      </Col>
    </Row>
  );
}
