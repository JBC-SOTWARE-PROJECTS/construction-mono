import { Terminal } from "@/graphql/gql/graphql";
import { EditOutlined } from "@ant-design/icons";
import { Row, Col, Table, Pagination, Button, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";

interface IProps {
  dataSource: Terminal[];
  loading: boolean;
  handleOpen: (record: Terminal) => void;
}

export default function TerminalTable({
  dataSource,
  loading,
  handleOpen,
}: IProps) {
  const columns: ColumnsType<Terminal> = [
    {
      title: "Terminal #",
      dataIndex: "terminal_no",
      key: "terminal_no",
      width: 120,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Assign Employee",
      dataIndex: "employee.fullName",
      key: "employee.fullName",
      render: (_: any, record: Terminal) => (
        <Tag color="cyan">{record.employee?.fullName}</Tag>
      ),
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      width: 50,
      render: (_: any, record: Terminal) => (
        <span>
          <Button
            size="small"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleOpen(record)}
          />
        </span>
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
          }}
          loading={loading}
          scroll={{ x: 1400 }}
        />
      </Col>
    </Row>
  );
}
