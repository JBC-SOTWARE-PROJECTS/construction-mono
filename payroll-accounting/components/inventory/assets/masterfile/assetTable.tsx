import React from 'react'
import { FolderOpenOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown } from "antd";
import { ColumnsType } from "antd/es/table";
import { Assets } from '@/graphql/gql/graphql';
import DescLong from "../../desclong";

type IProps = {
    dataSource: Assets[];
    loading: boolean;
    totalElements: number;
    handleOpen: (record: Assets) => void;
    handleAssign: (record: Assets) => void;
    handleSupplier: (record: Assets) => void;
    changePage: (page: number) => void;
}

export default function AssetTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  handleAssign,
  handleSupplier,
  changePage
}: IProps) {

    const columns: ColumnsType<Assets> = [
        {
          title: "Code",
          dataIndex: "code",
          key: "code",
          width: 20,
        },
        {
            title: "Description",
            dataIndex: "desc",
            key: "desc",
            width: 100,
        },
        // {
        //   title: "Description",
        //   dataIndex: "descLong",
        //   key: "descLong",
        //   render: (text, record) => <DescLong descripton={text} record={record} />,
        // },
        {
          title: "Brand",
          dataIndex: "brand",
          key: "brand",
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
  )
}