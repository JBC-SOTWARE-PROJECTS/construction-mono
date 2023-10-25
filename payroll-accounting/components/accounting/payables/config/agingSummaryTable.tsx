import { ApAgingSummaryDto } from "@/graphql/gql/graphql";
import { currency } from "@/utility/constant";
import { NumberFormater } from "@/utility/helper";
import { Row, Col, Table, Statistic } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";

interface IProps {
  dataSource: ApAgingSummaryDto[];
  loading: boolean;
}

const formatterRed = (value: number, color: string) => (
  <p className={`currency-${color}`}>
    {currency + " "}
    {NumberFormater(value)}
  </p>
);

export default function AgingSummaryTable({ dataSource, loading }: IProps) {
  const columns: ColumnsType<ApAgingSummaryDto> = [
    {
      title: "Suplier/Payee",
      dataIndex: "supplier",
      key: "supplier",
      width: 400,
    },
    {
      title: "Suplier Type",
      dataIndex: "supplier_type",
      key: "supplier_type",
    },
    {
      title: "Current",
      dataIndex: "current_amount",
      key: "current_amount",
      align: "right",
      width: 150,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "1-30 Days",
      dataIndex: "day_1_to_31",
      key: "day_1_to_31",
      align: "right",
      width: 150,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "31-60 Days",
      dataIndex: "day_31_to_60",
      key: "day_31_to_60",
      align: "right",
      width: 150,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "61-90 Days",
      dataIndex: "day_61_to_90",
      key: "day_61_to_90",
      align: "right",
      width: 150,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "91-120 Days",
      dataIndex: "day_91_to_120",
      key: "day_91_to_120",
      align: "right",
      width: 150,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "Older",
      dataIndex: "older",
      key: "older",
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
            title="TOTAL AGED PAYABLES"
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
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                <Table.Summary.Cell index={1} className="font-bold">
                  Total
                </Table.Summary.Cell>
                <Table.Summary.Cell
                  index={2}
                  align="right"
                  className="font-bold"
                >
                  <span>{currency} </span>
                  {NumberFormater(_.sumBy(dataSource, "current_amount"))}
                </Table.Summary.Cell>
                <Table.Summary.Cell
                  index={3}
                  align="right"
                  className="font-bold"
                >
                  <span>{currency} </span>
                  {NumberFormater(_.sumBy(dataSource, "day_1_to_31"))}
                </Table.Summary.Cell>
                <Table.Summary.Cell
                  index={4}
                  align="right"
                  className="font-bold"
                >
                  <span>{currency} </span>
                  {NumberFormater(_.sumBy(dataSource, "day_31_to_60"))}
                </Table.Summary.Cell>
                <Table.Summary.Cell
                  index={5}
                  align="right"
                  className="font-bold"
                >
                  <span>{currency} </span>
                  {NumberFormater(_.sumBy(dataSource, "day_61_to_90"))}
                </Table.Summary.Cell>
                <Table.Summary.Cell
                  index={6}
                  align="right"
                  className="font-bold"
                >
                  <span>{currency} </span>
                  {NumberFormater(_.sumBy(dataSource, "day_91_to_120"))}
                </Table.Summary.Cell>
                <Table.Summary.Cell
                  index={7}
                  align="right"
                  className="font-bold"
                >
                  <span>{currency} </span>
                  {NumberFormater(_.sumBy(dataSource, "older"))}
                </Table.Summary.Cell>
                <Table.Summary.Cell
                  index={8}
                  align="right"
                  className="font-bold"
                >
                  <span>{currency} </span>
                  {NumberFormater(_.sumBy(dataSource, "total"))}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
          scroll={{ x: 1600 }}
        />
      </Col>
    </Row>
  );
}
