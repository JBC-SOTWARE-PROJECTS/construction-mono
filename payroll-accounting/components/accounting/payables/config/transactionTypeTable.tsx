import { ApTransaction } from "@/graphql/gql/graphql";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Row, Col, Table, Pagination, Button, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { ReactNode } from "react";

interface IProps {
  dataSource: ApTransaction[];
  loading: boolean;
  totalElements: number;
  currentPage: number;
  handleOpen: (record: ApTransaction) => void;
  changePage: (page: number) => void;
  getLabel: (e: string) => ReactNode;
}

export default function TransactionTypeTable({
  dataSource,
  loading,
  totalElements = 1,
  currentPage = 0,
  handleOpen,
  changePage,
  getLabel,
}: IProps) {
  const columns: ColumnsType<ApTransaction> = [
    {
      title: "Transaction Description",
      dataIndex: "description",
      key: "description",
      width: 300,
    },
    {
      title: "Flag Value",
      dataIndex: "flagValue",
      key: "flagValue",
      width: 250,
    },
    {
      title: "Supplier Types",
      dataIndex: "supplierType.supplierTypeDesc",
      key: "supplierType.supplierTypeDesc",
      render: (text, record) => (
        <span
          key={text}
        >{`[${record.supplierType?.supplierTypeCode}] ${record.supplierType?.supplierTypeDesc}`}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => <span>{getLabel(text)}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      fixed: "right",
      width: 100,
      render: (status) => {
        let color = status ? "green" : "red";
        let text = status ? "Active" : "Inactive";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "#",
      key: "action",
      width: 50,
      fixed: "right",
      render: (text, record) => (
        <Button
          key={text}
          type="dashed"
          size="small"
          onClick={() => handleOpen(record)}
          icon={<FolderOpenOutlined />}
        />
      ),
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
              current={currentPage + 1}
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
