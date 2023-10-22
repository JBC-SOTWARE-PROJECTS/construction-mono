import { DisbursementCheck } from "@/graphql/gql/graphql";
import { currency } from "@/utility/constant";
import { getUrlPrefix } from "@/utility/graphql-client";
import {
  DateFormatter,
  NumberFormater,
  NumberInString,
} from "@/utility/helper";
import { PrinterOutlined } from "@ant-design/icons";
import { Row, Col, Table, Pagination, Button, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";

interface IProps {
  dataSource: DisbursementCheck[];
  loading: boolean;
  totalElements: number;
  changePage: (page: number) => void;
}

export default function PrintChecksTable({
  dataSource,
  loading,
  totalElements = 1,
  changePage,
}: IProps) {
  const columns: ColumnsType<DisbursementCheck> = [
    {
      title: "CK No",
      dataIndex: "disNo",
      key: "disNo",
      width: 100,
      render: (text, record) => (
        <span key={text}>{record.disbursement?.disNo}</span>
      ),
    },
    {
      title: "CK Date",
      dataIndex: "disDate",
      key: "disDate",
      width: 110,
      render: (text, record) => (
        <span key={text}>{DateFormatter(record.disbursement?.disDate)}</span>
      ),
    },
    {
      title: "Payee Name",
      dataIndex: "disbursement.payeeName",
      key: "disbursement.payeeName",
      width: 500,
      render: (text, record) => (
        <span key={text}>{record.disbursement?.payeeName}</span>
      ),
    },
    {
      title: "Supplier",
      dataIndex: "disbursement.supplier",
      key: "disbursement.supplier",
      width: 500,
      render: (text, record) => (
        <span key={text}>
          {record.disbursement?.supplier?.supplierFullname}
        </span>
      ),
    },
    {
      title: "Bank",
      dataIndex: "bank.bankname",
      key: "bank.bankname",
      width: 350,
      render: (text, record) => <span key={text}>{record.bank?.bankname}</span>,
    },
    {
      title: "Check Date",
      dataIndex: "checkDate",
      key: "checkDate",
      width: 100,
      render: (text) => <span key={text}>{DateFormatter(text)}</span>,
    },
    {
      title: "Check No",
      dataIndex: "disNo",
      key: "disNo",
      width: 100,
      render: (text, record) => <span key={text}>{record.checkNo}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
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
      dataIndex: "releasing",
      key: "releasing",
      align: "center",
      fixed: "right",
      width: 130,
      render: (text) => {
        if (_.isEmpty(text)) {
          return <span>--</span>;
        } else {
          return <Tag color="green">Released</Tag>;
        }
      },
    },
    {
      title: "#",
      key: "action",
      width: 85,
      fixed: "right",
      render: (text, record) => (
        <Button
          key={text}
          type="dashed"
          size="small"
          onClick={() => {
            let words = NumberInString(record.amount);
            if (!_.isEmpty(words)) {
              window.open(
                `${getUrlPrefix()}/reports/ap/print/check/${record.id}/${words}`
              );
            }
          }}
          icon={<PrinterOutlined />}>
          Print
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
          scroll={{ x: 2200 }}
        />
      </Col>
    </Row>
  );
}
