import { PayrollStatus, SubAccountBreakdownDto } from "@/graphql/gql/graphql";
import NumeralFormatter from "@/utility/numeral-formatter";
import { Empty, Table, Tag } from "antd";

function PayrollSubmoduleTotalsTable({
  dataSource,
  status,
  isAdjustment,
}: any) {
  const adjustmentColumn: any = [
    {
      title: "Type",
      dataIndex: "entryType",
      render: (value: string) => {
        return (
          <Tag color={value === "CREDIT" ? "green" : "red"}>
            {value === "CREDIT" ? "Addition" : "Deduction"}
          </Tag>
        );
      },
    },
  ];

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value: string) => <NumeralFormatter value={value} />,
    },
    ...(isAdjustment ? adjustmentColumn : []),
  ];

  return status === PayrollStatus.Finalized ? (
    <Table
      size="small"
      onHeaderRow={() => ({ style: { textAlignLast: "center" } })}
      columns={columns as any}
      dataSource={dataSource as SubAccountBreakdownDto[]}
      pagination={false}
    />
  ) : (
    <Empty description="Status is DRAFT. Please set to FINALIZED first." />
  );
}

export default PayrollSubmoduleTotalsTable;
