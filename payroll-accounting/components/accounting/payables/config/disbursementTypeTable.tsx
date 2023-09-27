import { ExpenseTransaction } from "@/graphql/gql/graphql";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Row, Col, Table, Button, Tag } from "antd";
import { ColumnsType } from "antd/es/table";

interface IProps {
  dataSource: ExpenseTransaction[];
  loading: boolean;
  handleOpen: (record: ExpenseTransaction) => void;
  changePage: (page: number) => void;
}

export default function DisbursementTypeTable({
  dataSource,
  loading,
  handleOpen,
}: IProps) {
  const columns: ColumnsType<ExpenseTransaction> = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 300,
    },
    {
      title: "Source Column",
      dataIndex: "source",
      key: "source",
      align: "center",
      width: 250,
      render: (source) => {
        return <Tag color="cyan">{source}</Tag>;
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      width: 250,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Reverse Normal Side",
      dataIndex: "isReverse",
      key: "isReverse",
      align: "center",
      width: 130,
      render: (status) => {
        let color = status ? "green" : "red";
        let text = status ? "Yes" : "No";
        return <Tag color={color}>{text}</Tag>;
      },
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
          pagination={{
            pageSize: 20,
            showSizeChanger: false,
            position: ["bottomLeft"],
          }}
          loading={loading}
          scroll={{ x: 1400 }}
        />
      </Col>
    </Row>
  );
}
