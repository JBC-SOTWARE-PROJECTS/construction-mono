import { TransactionType } from "@/graphql/gql/graphql";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Row, Col, Table, Tag, Button } from "antd";
import { ColumnsType } from "antd/es/table";

interface IProps {
  dataSource: TransactionType[];
  loading: boolean;
  handleOpen: (record: TransactionType) => void;
}

export default function InventoryTransactionTypeTable({
  dataSource,
  loading,
  handleOpen,
}: IProps) {
  // ===================== menus ========================

  // ===================== columns ========================
  const columns: ColumnsType<TransactionType> = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Flag Value",
      dataIndex: "flagValue",
      key: "flagValue",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      fixed: "right",
      width: 90,
      render: (text) => {
        let color = "red";
        if (text) {
          color = "green";
        }
        return <Tag color={color}>{text ? "Active" : "Inactive"}</Tag>;
      },
    },
    {
      title: "#",
      key: "action",
      width: 70,
      align: "center",
      fixed: "right",
      render: (_, record) => {
        return (
          <Button size="small" type="dashed" onClick={() => handleOpen(record)}>
            <FolderOpenOutlined />
          </Button>
        );
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
          pagination={{
            pageSize: 20,
            showSizeChanger: false,
          }}
          loading={loading}
          scroll={{ x: 1400 }}
        />
      </Col>
    </Row>
  );
}
