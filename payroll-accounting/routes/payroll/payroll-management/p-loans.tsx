import TablePaginated from "@/components/common/TablePaginated";
import PayrollHeader from "@/components/payroll/PayrollHeader";
import {
  PayrollEmployeeLoan,
  PayrollEmployeeLoanDto,
  PayrollLoanItem,
  PayrollModule,
} from "@/graphql/gql/graphql";
import { variables } from "@/hooks/payroll/contributions/useGetContributionEmployees";
import useGetPayrollEmployeeLoan from "@/hooks/payroll/loans/useGetPayrollEmployeeLoan";
import useUpdateLoanItemAmount from "@/hooks/payroll/loans/useUpdateLoanItemAmount";
import usePaginationState from "@/hooks/usePaginationState";
import { IPageProps } from "@/utility/interfaces";
import NumeralFormatter from "@/utility/numeral-formatter";
import { EditOutlined } from "@ant-design/icons";
import { InputNumber, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { capitalize } from "lodash";
import { useRef, useState } from "react";

const initialState: variables = {
  filter: "",
  size: 25,
  page: 0,
  status: [],
};
function PayrollLoans({ account }: IPageProps) {
  const [state, { onQueryChange }] = usePaginationState(initialState, 0, 25);
  const [editing, setEditing] = useState<string | null>(null);
  const amountRef = useRef<any>(null);
  const { data, loading, refetch } = useGetPayrollEmployeeLoan({
    variables: state,
  });
  const [updateAmount, loadingUpdateAmount] = useUpdateLoanItemAmount(() => {
    refetch();
  });

  const columns: ColumnsType<PayrollEmployeeLoanDto> = [
    { title: "Name", dataIndex: "employeeName" },
    { title: "Status", dataIndex: "status" },
  ];

  let expandedRowColumns: ColumnsType<PayrollLoanItem> = [
    {
      title: "Category",
      dataIndex: "category",
      sortOrder: "ascend",
      sorter: (a, b) =>
        (a?.category?.length as number) - (b?.category?.length as number),
      render: (value?) => capitalize(value?.replace("_", " ")),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value, { id }) =>
        editing === id ? (
          <InputNumber
            size="small"
            id="editable-amount"
            autoFocus
            onBlur={editAmount}
            ref={amountRef}
          />
        ) : (
          <div
            onClick={() => {
              setEditing(id);
            }}
          >
            <NumeralFormatter value={value} /> <EditOutlined />
          </div>
        ),
    },
  ];

  const editAmount = () => {
    const amount = amountRef?.current?.value;
    updateAmount(amount, editing as string);
    setEditing(null);
  };
  return (
    <>
      <PayrollHeader module={PayrollModule.Loans} extra={<></>} />

      <TablePaginated
        columns={columns}
        loading={loading}
        size={"small"}
        dataSource={data?.content}
        expandable={{
          expandedRowRender: (record) => {
            console.log(record);
            return (
              <Table
                pagination={false}
                dataSource={record?.employee?.loanItems}
                columns={expandedRowColumns}
              />
            );
          },
          rowExpandable: (record) => record?.employee?.loanItems.length > 0,
        }}
        total={data?.totalElements}
        pageSize={state.size}
        onChange={onQueryChange}
        current={state.page}
        rowKey={(record: any) => record?.employee?.id}
      />
    </>
  );
}

export default PayrollLoans;
