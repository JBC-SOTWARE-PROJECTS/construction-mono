import { Billing } from "@/graphql/gql/graphql";
import { currency } from "@/utility/constant";
import { DateFormatter, NumberFormater } from "@/utility/helper";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Row, Col, Table, Pagination, Button, Tag } from "antd";
import { ColumnsType } from "antd/es/table";

interface IProps {
  dataSource: Billing[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: Billing) => void;
  changePage: (page: number) => void;
}

export default function BillingTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  changePage,
}: IProps) {
  const columns: ColumnsType<Billing> = [
    {
      title: "Transaction Date",
      dataIndex: "dateTrans",
      key: "dateTrans",
      render: (date) => DateFormatter(date),
    },
    {
      title: "Billing/Folio #",
      dataIndex: "billNo",
      key: "billNo",
      align: "center",
      render: (text) => <span className="font-bold">{text}</span>,
    },
    {
      title: "Project #",
      dataIndex: "project.projectCode",
      key: "project.projectCode",
      align: "center",
      render: (_, record) => (
        <Tag
          color="cyan"
          className="cursor-pointer"
          onClick={() => console.log("go to [project] details")}
        >
          {record.project?.projectCode}
        </Tag>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customer.fullName",
      key: "customer.fullName",
      render: (_, record) => <span>{record.customer?.fullName}</span>,
    },
    {
      title: "Description",
      dataIndex: "project.description",
      key: "project.description",
      width: 400,
      render: (_, record) => <span>{record.project?.description}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 100,
      render: (text) => {
        let color = "red";
        if (text) {
          color = "green";
        }
        return <Tag color={color}>{text ? "Active" : "Inactive"}</Tag>;
      },
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      align: "right",
      fixed: "right",
      width: 130,
      render: (bal) => {
        let color = "red";
        if (bal <= 0) {
          color = "green";
        }
        return (
          <Tag color={color}>
            {currency} {NumberFormater(bal)}
          </Tag>
        );
      },
    },
    {
      title: "#",
      key: "action",
      width: 50,
      align: "center",
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