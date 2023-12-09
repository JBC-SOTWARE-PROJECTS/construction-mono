import { ItemSubAccount } from "@/graphql/gql/graphql";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Row, Col, Table, Tag, Button } from "antd";
import { ColumnsType } from "antd/es/table";

interface IProps {
  dataSource: ItemSubAccount[];
  loading: boolean;
  handleOpen: (record: ItemSubAccount) => void;
}

export default function ItemSubAccountTable({
  dataSource,
  loading,
  handleOpen,
}: IProps) {
  // ===================== menus ========================

  // ===================== columns ========================
  const columns: ColumnsType<ItemSubAccount> = [
    {
      title: "Code",
      dataIndex: "subAccountCode",
      key: "subAccountCode",
      width: 140,
    },
    {
      title: "Description",
      dataIndex: "subAccountDescription",
      key: "subAccountDescription",
    },
    {
      title: "Source Column",
      dataIndex: "sourceColumn",
      key: "sourceColumn",
      align: "center",
      fixed: "right",
      width: 120,
      render: (text) => {
        return (
          <Tag color="cyan" key={text}>
            {text}
          </Tag>
        );
      },
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
