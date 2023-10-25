import { ApLedgerDto } from "@/graphql/gql/graphql";
import { currency } from "@/utility/constant";
import { DateFormatter, NumberFormater } from "@/utility/helper";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Row, Col, Table, Button, Statistic } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";

interface IProps {
  dataSource: ApLedgerDto[];
  loading: boolean;
  handleOpen: (record: ApLedgerDto) => void;
}

const formatterRed = (value: number, color: string) => (
  <p className={`currency-${color}`}>
    {currency + " "}
    {NumberFormater(value)}
  </p>
);

const responsive = {
  xs: 24,
  sm: 12,
  lg: 8,
};

export default function SubsidiaryTable({
  dataSource,
  loading,
  handleOpen,
}: IProps) {
  const columns: ColumnsType<ApLedgerDto> = [
    {
      title: "Type",
      dataIndex: "ledger_type",
      key: "ledger_type",
    },
    {
      title: "Date",
      dataIndex: "ledger_date",
      key: "ledger_date",
      width: 110,
      render: (text) => <span>{DateFormatter(text) }</span>,
    },
    {
      title: "Refrerence No",
      dataIndex: "ref_no",
      key: "ref_no",
    },
    {
      title: "Debit",
      dataIndex: "debit",
      key: "debit",
      align: "right",
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      align: "right",
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "Running Balance",
      dataIndex: "running_balance",
      key: "running_balance",
      align: "right",
      fixed: "right",
      width: 160,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "Outstanding Balance",
      dataIndex: "out_balance",
      key: "out_balance",
      align: "right",
      fixed: "right",
      width: 160,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
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
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <div className="w-full dev-right">
          <Statistic
            title="Beginning Balance"
            value={_.head(dataSource)?.beg_balance}
            formatter={(e) => {
              let value = Number(e);
              return formatterRed(value, "green");
            }}
          />
        </div>
      </Col>
      <Col span={24}>
        <Table
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          loading={loading}
          scroll={{ x: 1400 }}
        />
      </Col>
      <Col span={24}>
        <div className="w-full dev-between">
          <Statistic
            title="UNAPPLIED VOUCHERS"
            value={_.sumBy(dataSource, function (e) {
              if (e.ledger_type === "CK" || e.ledger_type === "CS") {
                return e.out_balance;
              }
            })}
            formatter={(e) => {
              let value = Number(e);
              return formatterRed(value, "orange");
            }}
          />
          <Statistic
            title="ENDING BALANCE "
            value={_.last(dataSource)?.running_balance}
            formatter={(e) => {
              let value = Number(e);
              return formatterRed(value, "blue");
            }}
          />
        </div>
      </Col>
      {/* <Col {...responsive}>
        <Statistic
          title="UNAPPLIED VOUCHERS"
          value={_.sumBy(dataSource, function (e) {
            if (e.ledger_type === "CK" || e.ledger_type === "CS") {
              return e.out_balance;
            }
          })}
          formatter={(e) => {
            let value = Number(e);
            return formatterRed(value, "orange");
          }}
        />
      </Col>
      <Col {...responsive}>
        <Statistic
          title="UNAPPLIED DEBIT MEMO"
          value={0.0}
          formatter={(e) => {
            let value = Number(e);
            return formatterRed(value, "red");
          }}
        />
      </Col>
      <Col {...responsive}>
        <Statistic
          title="ENDING BALANCE "
          value={_.last(dataSource)?.running_balance}
          formatter={(e) => {
            let value = Number(e);
            return formatterRed(value, "blue");
          }}
        />
      </Col> */}
    </Row>
  );
}
