import { ApBeginningBalanceDto } from "@/graphql/gql/graphql";
import { currency } from "@/utility/constant";
import { NumberFormater } from "@/utility/helper";
import { Row, Col, Table, Statistic } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";

interface IProps {
  dataSource: ApBeginningBalanceDto[];
  loading: boolean;
}

const formatterRed = (value: number, color: string) => (
  <p className={`currency-${color}`}>
    {currency} {NumberFormater(value)}
  </p>
);

export default function BeginningBalanceTable({ dataSource, loading }: IProps) {
  const columns: ColumnsType<ApBeginningBalanceDto> = [
    {
      title: "Suplier/Payee",
      dataIndex: "supplierFullname",
      key: "supplierFullname",
    },
    {
      title: "Suplier Type",
      dataIndex: "supplierType",
      key: "supplierType",
      width: 150,
    },

    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      align: "right",
      fixed: "right",
      width: 150,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
  ];

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <div className="dev-right">
          <Statistic
            title="TOTAL BEGINNING BALANCE"
            value={_.sumBy(dataSource, "total")}
            formatter={(e) => {
              let value = Number(e);
              return formatterRed(value, "blue");
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
