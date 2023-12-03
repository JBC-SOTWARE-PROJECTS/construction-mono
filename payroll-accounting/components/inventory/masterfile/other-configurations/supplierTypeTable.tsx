import { SupplierType } from "@/graphql/gql/graphql";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Row, Col, Table, Tag, Button } from "antd";
import { ColumnsType } from "antd/es/table";

interface IProps {
  dataSource: SupplierType[];
  loading: boolean;
  handleOpen: (record: SupplierType) => void;
}

export default function SupplierTypeTable({
  dataSource,
  loading,
  handleOpen,
}: IProps) {
  // ===================== menus ========================

  // ===================== columns ========================
  const columns: ColumnsType<SupplierType> = [
    {
      title: "Code",
      dataIndex: "supplierTypeCode",
      key: "supplierTypeCode",
      width: 140,
    },
    {
      title: "Description",
      dataIndex: "supplierTypeDesc",
      key: "supplierTypeDesc",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
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
