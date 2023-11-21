import React from "react";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { AssetMaintenanceTypes, AssetStatus, Assets } from "@/graphql/gql/graphql";
import DescLong from "../../desclong";
import { AssetStatusColor } from "@/utility/constant";
import { useRouter } from "next/router";

type IProps = {
  dataSource: AssetMaintenanceTypes[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: AssetMaintenanceTypes) => void;
  handleAssign: (record: AssetMaintenanceTypes) => void;
  handleSupplier: (record: AssetMaintenanceTypes) => void;
  changePage: (page: number) => void;
};

export default function MaintenanceTypeTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  handleAssign,
  handleSupplier,
  changePage,
}: IProps) {
  const router = useRouter();
  const columns: ColumnsType<AssetMaintenanceTypes> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 100,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "desc",
      width: 100,
    },
    {
      title: "Action",
      dataIndex: "brand",
      key: "brand",
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
