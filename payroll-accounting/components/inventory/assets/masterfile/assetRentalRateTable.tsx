import React from "react";
import { EditOutlined } from "@ant-design/icons";
import { Row, Col, Table, Pagination,  Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { RentalRates } from "@/graphql/gql/graphql";
import { useRouter } from "next/router";

type IProps = {
  dataSource: RentalRates[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: RentalRates) => void;
  changePage: (page: number) => void;
};

export default function AssetRentalRateTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  changePage,
}: IProps) {
  const router = useRouter();
  const columns: ColumnsType<RentalRates> = [
    {
      title: "Type",
      dataIndex: "rentType",
      key: "rentType",
      width: 100,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "desc",
      width: 100,
    },
    {
      title: "Coverage Range",
      dataIndex: "coverage",
      key: "coverage",
      width: 100,
      render: (_, record: RentalRates) => {
        return (<>  {record?.coverageStart} - {record?.coverageEnd}</>)
      }
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      width: 100,
    },
    
    {
      title: "Amount",
      dataIndex: "amount",
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
        />
      </Col>
    </Row>
  );
}
