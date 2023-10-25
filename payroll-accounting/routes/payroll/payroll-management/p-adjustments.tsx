import CustomButton from "@/components/common/CustomButton";
import TablePaginated from "@/components/common/TablePaginated";
import PayrollHeader from "@/components/payroll/PayrollHeader";
import PayrollEmployeeStatusAction from "@/components/payroll/payroll-management/PayrollEmployeeStatusAction";
import PayrollModuleRecalculateAllEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateAllEmployeeAction";
import PayrollModuleRecalculateEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateEmployeeAction";
import {
  PayrollEmployeeAdjustmentDto,
  PayrollEmployeeLoanDto,
  PayrollLoanItem,
  PayrollModule,
  PayrollStatus,
} from "@/graphql/gql/graphql";
import { variables } from "@/hooks/payroll/contributions/useGetContributionEmployees";
import useGetPayrollEmployeeLoan from "@/hooks/payroll/loans/useGetPayrollEmployeeLoan";
import useGetPayrollLoan from "@/hooks/payroll/loans/useGetPayrollLoan";
import useUpdateLoanItemAmount from "@/hooks/payroll/loans/useUpdateLoanItemAmount";
import useUpdatePayrollLoanStatus from "@/hooks/payroll/loans/useUpdatePayrollLoanStatus";
import usePaginationState from "@/hooks/usePaginationState";
import { statusMap } from "@/utility/constant";
import { getStatusColor } from "@/utility/helper";
import { IPageProps } from "@/utility/interfaces";
import NumeralFormatter from "@/utility/numeral-formatter";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import { Divider, InputNumber, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { capitalize } from "lodash";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { recalculateButton } from "./p-contributions";
import useGetPayrollEmployeeAdjustment from "@/hooks/payroll/adjustments/useGetPayrollEmployeeAdjustment";
import { PayrollEmployeeFilter } from "@/components/payroll/payroll-management/PayrollEmployeeFilter";
import AddAdjustmentItemsModal from "@/components/payroll/payroll-management/adjustments/AddAdjustmentItemsModal";

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
  const { data, loading, refetch, dataList } = useGetPayrollEmployeeAdjustment({
    variables: state,
  });
  const [updateAmount, loadingUpdateAmount] = useUpdateLoanItemAmount(() => {
    refetch();
  });

  const [updateStatus, loadingUpdateStatus] = useUpdatePayrollLoanStatus(() => {
    refetchLoan();
    refetch();
  });
  const columns: ColumnsType<PayrollEmployeeLoanDto> = [
    { title: "Name", dataIndex: "employeeName" },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => <Tag color={getStatusColor(value)}>{value}</Tag>,
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (value, { status }) => {
        return (
          <>
            <PayrollModuleRecalculateEmployeeAction
              id={value}
              module={PayrollModule.Adjustment}
              buttonProps={recalculateButton}
              refetch={refetch}
              // allowedPermissions={[]}
            />
            <PayrollEmployeeStatusAction
              id={value}
              module={PayrollModule.Adjustment}
              value={status}
              refetch={refetch}
            />
          </>
        );
      },
    },
  ];

  let expandedRowColumns: ColumnsType<PayrollEmployeeAdjustmentDto> = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (value) => (
        <Tag color={value === "ADDITION" ? "green" : "red"}>{value}</Tag>
      ),
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
              setEditing(id as string);
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

  const handleClickFinalize = () => {
    updateStatus({
      payrollId: router?.query?.id as string,
      status: statusMap[loan?.status],
    });
  };
  return (
    <>
      <PayrollHeader
        module={PayrollModule.Adjustment}
        status={loan?.status}
        showTitle
        extra={
          <>
            {loan?.status === PayrollStatus.Draft && (
              <PayrollModuleRecalculateAllEmployeeAction
                id={router?.query?.id as string}
                module={PayrollModule.Adjustment}
                buttonProps={recalculateButton}
                tooltipProps={{ placement: "topRight" }}
                refetch={refetch}
              >
                Recalculate All Employee Loan
              </PayrollModuleRecalculateAllEmployeeAction>
            )}

            <CustomButton
              type="primary"
              icon={
                loan?.status === "FINALIZED" ? (
                  <EditOutlined />
                ) : (
                  <CheckOutlined />
                )
              }
              onClick={handleClickFinalize}
            >
              Set as {statusMap[loan?.status]}
            </CustomButton>
          </>
        }
      />

      <div
        style={{
          display: "flex",
          justifyContent: "end",
          width: "100%",
        }}
      >
        <div style={{ width: "80%", marginRight: 10 }}>
          <PayrollEmployeeFilter onQueryChange={onQueryChange} />
        </div>

        <AddAdjustmentItemsModal refetch={refetch} employeeList={dataList} />
      </div>

      <TablePaginated
        columns={columns}
        loading={loading || loadingUpdateAmount || loadingLoan}
        size={"small"}
        dataSource={data?.content}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <Table
                pagination={false}
                dataSource={record?.employee?.items}
                columns={expandedRowColumns}
              />
            );
          },
          rowExpandable: (record) => record?.employee?.items.length > 0,
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
