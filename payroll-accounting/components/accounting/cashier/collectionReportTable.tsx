import { Shift } from "@/graphql/gql/graphql";
import { DateFormatterWithTime } from "@/utility/helper";
import { EditOutlined, PrinterOutlined } from "@ant-design/icons";
import { Row, Col, Table, Button, Tag, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";

interface IProps {
  dataSource: Shift[];
  loading: boolean;
  handlePrint: (record: Shift) => void;
  handleRemarks: (record: Shift) => void;
}

export default function CollectionReportTable({
  dataSource,
  loading,
  handlePrint,
  handleRemarks,
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
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      width: 350,
      render: (text) => <span>{text ?? "--"}</span>,
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="dashed"
            size="small"
            icon={<PrinterOutlined />}
            onClick={() => handlePrint(record)}
          />
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleRemarks(record)}
          />
        </Space>
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
