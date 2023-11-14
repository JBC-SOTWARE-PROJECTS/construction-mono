import React from "react";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { AssetStatus, Assets } from "@/graphql/gql/graphql";
import DescLong from "../../desclong";
import { AssetStatusColor } from "@/utility/constant";
import { useRouter } from "next/router";

type IProps = {
  dataSource: Assets[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: Assets) => void;
  handleAssign: (record: Assets) => void;
  handleSupplier: (record: Assets) => void;
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
  const columns: ColumnsType<Assets> = [
    {
      title: "Code",
      dataIndex: "assetCode",
      key: "code",
      width: 100,
    },
    {
      title: "Item",
      dataIndex: "item.descLong",
      key: "desc",
      width: 100,
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
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
          scroll={{ x: 1400 }}
        />
      </Col>
    </Row>
  );
}
