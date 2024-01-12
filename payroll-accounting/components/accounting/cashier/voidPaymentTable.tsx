import { Shift } from "@/graphql/gql/graphql";
import { DateFormatterWithTime } from "@/utility/helper";
import { Row, Col, Table, Button, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";

interface IProps {
  dataSource: Shift[];
  loading: boolean;
  handleOpen: (record: Shift) => void;
}

export default function VoidPaymentTable({
  dataSource,
  loading,
  handleOpen,
}: IProps) {
  const columns: ColumnsType<Shift> = [
    {
      title: "Terminal #",
      dataIndex: "terminal_no",
      key: "terminal_no",
      render: (_, record) => <span>{record.terminal?.terminal_no}</span>,
    },
    {
      title: "Shift #",
      dataIndex: "shiftNo",
      key: "shiftNo",
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Start Shift",
      dataIndex: "startShift",
      key: "startShift",
      render: (startShift) => (
        <span>{startShift ? DateFormatterWithTime(startShift) : "--"}</span>
      ),
    },
    {
      title: "End Shift",
      dataIndex: "endShift",
      key: "endShift",
      render: (endShift) => (
        <span>{endShift ? DateFormatterWithTime(endShift) : "--"}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button type="primary" danger onClick={() => handleOpen(record)}>
          Void OR/SI
        </Button>
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
