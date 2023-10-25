import { ReleaseCheck } from "@/graphql/gql/graphql";
import { currency } from "@/utility/constant";
import { DateFormatter, NumberFormater } from "@/utility/helper";
import { Row, Col, Table, Pagination } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";

interface IProps {
  dataSource: ReleaseCheck[];
  loading: boolean;
  totalElements: number;
  changePage: (page: number) => void;
}

export default function ReleasedChecksTable({
  dataSource,
  loading,
  totalElements = 1,
  changePage,
}: IProps) {
  const columns: ColumnsType<ReleaseCheck> = [
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      key: "releaseDate",
      width: 100,
      render: (text) => <span>{DateFormatter(text)}</span>,
    },
    {
      title: "Supplier",
      dataIndex: "disbursement.payeeName",
      key: "disbursement.payeeName",
      width: 500,
      render: (text, record) => (
        <span key={text}>{record.disbursement?.payeeName}</span>
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
      title: "Check No",
      dataIndex: "disNo",
      key: "disNo",
      width: 100,
      render: (text, record) => <span key={text}>{record.check?.checkNo}</span>,
    },
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
      dataIndex: "disNo",
      key: "disNo",
      width: 100,
      render: (text, record) => (
        <span key={text}>{DateFormatter(record.disbursement?.disDate)}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "check.amount",
      key: "check.amount",
      align: "right",
      fixed: "right",
      width: 130,
      render: (text, record) => (
        <span key={text}>
          <small>{currency} </small>
          {NumberFormater(record.check?.amount)}
        </span>
      ),
    },
    {
      title: "Released By",
      dataIndex: "release_by",
      key: "release_by",
      align: "center",
      fixed: "right",
      width: 130,
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
