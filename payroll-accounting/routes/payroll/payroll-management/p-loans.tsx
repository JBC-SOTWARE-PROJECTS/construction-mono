import TablePaginated from "@/components/common/TablePaginated";
import PayrollHeader from "@/components/payroll/PayrollHeader";
import PayrollModuleRecalculateAllEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateAllEmployeeAction";
import {
  PayrollEmployeeLoan,
  PayrollEmployeeLoanDto,
  PayrollEmployeeStatus,
  PayrollLoanItem,
  PayrollModule,
  PayrollStatus,
} from "@/graphql/gql/graphql";
import { variables } from "@/hooks/payroll/contributions/useGetContributionEmployees";
import useGetPayrollEmployeeLoan from "@/hooks/payroll/loans/useGetPayrollEmployeeLoan";
import useUpdateLoanItemAmount from "@/hooks/payroll/loans/useUpdateLoanItemAmount";
import usePaginationState from "@/hooks/usePaginationState";
import { IPageProps } from "@/utility/interfaces";
import NumeralFormatter from "@/utility/numeral-formatter";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import { InputNumber, Table, Tag, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { capitalize } from "lodash";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { recalculateButton } from "./p-contributions";
import PayrollModuleRecalculateEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateEmployeeAction";
import PayrollEmployeeStatusAction from "@/components/payroll/payroll-management/PayrollEmployeeStatusAction";
import { getStatusColor } from "@/utility/helper";
import useGetPayrollLoan from "@/hooks/payroll/loans/useGetPayrollLoan";
import CustomButton from "@/components/common/CustomButton";
import { statusMap } from "@/utility/constant";
import useUpdatePayrollLoanStatus from "@/hooks/payroll/loans/useUpdatePayrollLoanStatus";
import { PayrollEmployeeFilter } from "@/components/payroll/payroll-management/PayrollEmployeeFilter";

const initialState: variables = {
  filter: "",
  size: 25,
  page: 0,
  status: [],
};
function PayrollLoans({ account }: IPageProps) {
  const router = useRouter();
  const [state, { onQueryChange }] = usePaginationState(initialState, 0, 25);
  const [editing, setEditing] = useState<string | null>(null);
  const amountRef = useRef<any>(null);
  const [loan, loadingLoan, refetchLoan] = useGetPayrollLoan();
  const { data, loading, refetch } = useGetPayrollEmployeeLoan({
    variables: state,
  });
  const [updateAmount, loadingUpdateAmount] = useUpdateLoanItemAmount(() => {
    refetch();
  });

  const [updateStatus, loadingUpdateStatus] = useUpdatePayrollLoanStatus(() => {
    refetchLoan();
    refetch();
  });

  const action: ColumnsType<PayrollEmployeeLoanDto> = [
    {
      title: "Action",
      dataIndex: "id",
      render: (value, { status }) => {
        return (
          <>
            <PayrollModuleRecalculateEmployeeAction
              id={value}
              module={PayrollModule.Loans}
              buttonProps={recalculateButton}
              refetch={refetch}
              // allowedPermissions={[]}
            />
            <PayrollEmployeeStatusAction
              id={value}
              module={PayrollModule.Loans}
              value={status}
              refetch={refetch}
            />
          </>
        );
      },
    },
  ];

  const columns: ColumnsType<PayrollEmployeeLoanDto> = [
    { title: "Name", dataIndex: "employeeName" },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => <Tag color={getStatusColor(value)}>{value}</Tag>,
    },
    ...(loan?.status === PayrollStatus.Draft ? action : []),
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
              if (loan?.status === PayrollStatus.Draft) setEditing(id);
            }}
          >
            <NumeralFormatter value={value} />{" "}
            {loan?.status === PayrollStatus.Draft && <EditOutlined />}
          </div>
        ),
    },
  ];

  const editAmount = () => {
    const amount = amountRef?.current?.value;
    updateAmount(amount, editing as string);
    setEditing(null);
  };

  const handleClickFinalize = () => {
    let countDraft = 0;
    data?.content?.forEach((item: any) => {
      if (item.status === PayrollEmployeeStatus.Draft) countDraft++;
    });
    if (countDraft > 0 && loan.status === "DRAFT") {
      message.error(
        "There are still some DRAFT employees. Please finalize all employees first"
      );
    } else {
      updateStatus({
        payrollId: router?.query?.id as string,
        status: statusMap[loan?.status],
      });
    }
  };
  return (
    <>
      <PayrollHeader
        module={PayrollModule.Loans}
        status={loan?.status}
        showTitle
        handleClickFinalize={handleClickFinalize}
        loading={loadingUpdateStatus}
        extra={
          <>
            {loan?.status === PayrollStatus.Draft && (
              <PayrollModuleRecalculateAllEmployeeAction
                id={router?.query?.id as string}
                module={PayrollModule.Loans}
                buttonProps={recalculateButton}
                tooltipProps={{ placement: "topRight" }}
                refetch={refetch}
              >
                Recalculate All Employee Loan
              </PayrollModuleRecalculateAllEmployeeAction>
            )}
          </>
        }
      />
      <PayrollEmployeeFilter onQueryChange={onQueryChange} />

      <TablePaginated
        columns={columns}
        loading={loading || loadingUpdateAmount || loadingLoan}
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
