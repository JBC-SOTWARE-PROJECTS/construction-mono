import { CompanySettings } from "@/graphql/gql/graphql";
import { currency } from "@/utility/constant";
import { DateFormatter, NumberFormater } from "@/utility/helper";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Row, Col, Table, Pagination, Button, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

interface IProps {
  dataSource: CompanySettings[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: CompanySettings) => void;
  changePage: (page: number) => void;
}

export default function CompanyTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  changePage,
}: IProps) {
  const columns: ColumnsType<CompanySettings> = [
    {
      title: "A/P No",
      dataIndex: "apNo",
      key: "apNo",
      width: 100,
    },
    {
      title: "A/P Date",
      dataIndex: "apvDate",
      key: "apvDate",
      width: 110,
      render: (text) => <span>{DateFormatter(text)}</span>,
    },
    {
      title: "Due Date",
      key: "dueDate",
      dataIndex: "dueDate",
      width: 110,
      align: "center",
      render: (text, record) => {
        return <span>{record.companyName}</span>;
      },
    },
    {
      title: "Supplier",
      dataIndex: "supplier.supplierFullname",
      key: "supplier.supplierFullname",
      render: (text, record) => <span key={text}>{record.companyName}</span>,
    },
    {
      title: "Amount",
      dataIndex: "grossAmount",
      key: "grossAmount",
      align: "right",
      width: 130,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "Discount",
      dataIndex: "discountAmount",
      key: "discountAmount",
      align: "right",
      width: 130,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "EWT",
      dataIndex: "ewtAmount",
      key: "ewtAmount",
      align: "right",
      width: 130,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "Net Amount",
      dataIndex: "netAmount",
      key: "netAmount",
      align: "right",
      fixed: "right",
      width: 130,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      align: "right",
      fixed: "right",
      width: 130,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      fixed: "right",
      width: 90,
      render: (text, record) => {
        let color = "orange";

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
              showSizeChanger={false}
              pageSize={10}
              responsive={true}
              total={totalElements}
              onChange={(e) => {
                changePage(e - 1);
              }}
            />
          )}
          expandable={{
            expandedRowRender: (record) => <>sample</>,
          }}
          scroll={{ x: 1600 }}
        />
      </Col>
    </Row>
  );
}
