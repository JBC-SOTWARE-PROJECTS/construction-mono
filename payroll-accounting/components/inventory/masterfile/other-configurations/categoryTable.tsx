import { ItemCategory } from "@/graphql/gql/graphql";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Row, Col, Table, Tag, Button } from "antd";
import { ColumnsType } from "antd/es/table";

interface IProps {
  dataSource: ItemCategory[];
  loading: boolean;
  handleOpen: (record: ItemCategory) => void;
}

export default function ItemCategoryTable({
  dataSource,
  loading,
  handleOpen,
}: IProps) {
  // ===================== menus ========================

  // ===================== columns ========================
  const columns: ColumnsType<ItemCategory> = [
    {
      title: "Code",
      dataIndex: "categoryCode",
      key: "categoryCode",
      width: 140,
    },
    {
      title: "Prefix Code",
      dataIndex: "prefixCode",
      key: "prefixCode",
      width: 100,
      render: (text) => {
        return <span>{text ?? "--"}</span>;
      },
    },
    {
      title: "Description",
      dataIndex: "categoryDescription",
      key: "categoryDescription",
    },
    {
      title: "Tag",
      dataIndex: "itemGroup.itemDescription",
      key: "itemGroup.itemDescription",
      align: "center",
      fixed: "right",
      width: 250,
      render: (text, record) => {
        return (
          <Tag color="cyan" key={text}>
            {record?.itemGroup?.itemDescription}
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
