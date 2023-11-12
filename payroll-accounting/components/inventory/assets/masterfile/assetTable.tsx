import React from "react";
import { FolderOpenOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown } from "antd";
import { ColumnsType } from "antd/es/table";
import { Assets } from "@/graphql/gql/graphql";
import DescLong from "../../desclong";
import { AssetStatusColor } from "@/utility/constant";

type IProps = {
  dataSource: Assets[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: Assets) => void;
  handleAssign: (record: Assets) => void;
  handleSupplier: (record: Assets) => void;
  changePage: (page: number) => void;
};

export default function AssetTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  handleAssign,
  handleSupplier,
  changePage,
}: IProps) {
  const columns: ColumnsType<Assets> = [
    {
      title: "Code",
      dataIndex: "assetCode",
      key: "code",
      width: 50,
    },
    {
      title: "Item",
      dataIndex: "item.descLong",
      key: "desc",
      width: 100,
      render: (_, record) => <span>{record?.item?.descLong}</span>,
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      width: 50,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      width: 100,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 80,
      render: (_, record) => {
        return <Tag color="blue">{record?.type?.replace(/_/g, " ")}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 50,
      fixed: "right",
      render: (_, record) => {
        return <Tag color={AssetStatusColor[record?.status ?? "NO_STATUS"]}>{record?.status ? record?.status?.replace(/_/g, " ") : "NO STATUS"}</Tag>;
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
              //   total={totalElements}
              //   onChange={(e) => {
              //     changePage(e - 1);
              //   }}
            />
          )}
          scroll={{ x: 1400 }}
        />
      </Col>
    </Row>
  );
}
