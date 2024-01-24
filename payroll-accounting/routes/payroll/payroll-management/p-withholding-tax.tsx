import PayrollHeader from "@/components/payroll/PayrollHeader";
import { PayrollEmployeeFilter } from "@/components/payroll/payroll-management/PayrollEmployeeFilter";
import PayrollEmployeeStatusAction from "@/components/payroll/payroll-management/PayrollEmployeeStatusAction";
import PayrollModuleRecalculateEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateEmployeeAction";
import {
  PayrollEmployeeListDto,
  PayrollEmployeeOtherDeductionDto,
  PayrollEmployeeStatus,
  PayrollModule,
  PayrollStatus,
} from "@/graphql/gql/graphql";
import { variables } from "@/hooks/payroll/contributions/useGetContributionEmployees";
import useGetPayrollEmployeeOtherDeduction from "@/hooks/payroll/other-deductions/useGetPayrollEmployeeOtherDeduction";
import useGetPayrollOtherDeduction from "@/hooks/payroll/other-deductions/useGetPayrollOtherDeduction";
import useUpdatePayrollOtherDeductionStatus from "@/hooks/payroll/other-deductions/useUpdatePayrollOtherDeductionStatus";
import useGetPayrollHRMEmployees from "@/hooks/payroll/useGetPayrollHRMEmployees";
import usePaginationState from "@/hooks/usePaginationState";
import { statusMap } from "@/utility/constant";
import { getStatusColor } from "@/utility/helper";
import { IPageProps } from "@/utility/interfaces";
import NumeralFormatter from "@/utility/numeral-formatter";
import { Empty, Modal, Space, Tag, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";
import { recalculateButton } from "./p-contributions";
import { Table } from "antd/lib";
import useGetPayrollEmployees from "@/hooks/payroll/useGetPayrollEmployees";
import useGetOnePayroll from "@/hooks/payroll/useGetOnePayroll";
import CustomButton from "@/components/common/CustomButton";
import {
  CheckOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import useRecalculateWithholdingTax from "@/hooks/payroll/useRecalculateWithholdingTax";
import useUpdatePayrollEmployeeStatus from "@/hooks/payroll/useUpdatePayrollEmployeeStatus";
import useGetPayrollEmployeesPageable from "@/hooks/payroll/useGetPayrollEmployeesPageable";
import TablePaginated from "@/components/common/TablePaginated";
const initialState: variables = {
  filter: "",
  size: 25,
  page: 0,
  status: [],
};
function WithholdingTax({ account }: IPageProps) {
  const router = useRouter();
  const [state, { onQueryChange, onNextPage }] = usePaginationState(
    initialState,
    0,
    25
  );

  const [employees, loadingPayrollEmployees, refetch, totalElements] =
    useGetPayrollEmployeesPageable({ variables: state });

  const [payroll] = useGetOnePayroll();
  const [recalculateWithholdingTax, loadingRecalculate] =
    useRecalculateWithholdingTax(() => refetch());

  const [updateStatus, loadingUpdateStatus] = useUpdatePayrollEmployeeStatus(
    () => refetch()
  );

  const confirmRecalculate = (id?: string) => {
    Modal.confirm({
      title: `Are you sure you want to recalculate ${
        id ? "this employee's" : "all employee"
      } withholding tax?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        recalculateWithholdingTax(id);
      },
      onCancel() {},
    });
  };
  const actionColumn: ColumnsType<PayrollEmployeeListDto> = [
    {
      title: "Action",
      dataIndex: "id",
      render: (value, { status }) => {
        return (
          <Space>
            <CustomButton
              icon={<ReloadOutlined />}
              tooltip="Recalculate Withholding Tax"
              danger
              onClick={() => {
                confirmRecalculate(value);
              }}
              // allowedPermissions={[]}
            />
            <CustomButton
              icon={status === "DRAFT" ? <CheckOutlined /> : <EditOutlined />}
              tooltip={`Set as ${statusMap[status as string]}`}
              type="primary"
              ghost
              onClick={() => {
                updateStatus(value, statusMap[status as string]);
              }}
            ></CustomButton>
          </Space>
        );
      },
    },
  ];

  const columns: ColumnsType<PayrollEmployeeListDto> = [
    { title: "Name", dataIndex: "fullName" },
    {
      title: "Timekeeping",
      dataIndex: "timekeepingStatus",
      render: (value) => <Tag color={getStatusColor(value)}>{value}</Tag>,
    },
    {
      title: "Contribution",
      dataIndex: "contributionStatus",
      render: (value) => <Tag color={getStatusColor(value)}>{value}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => <Tag color={getStatusColor(value)}>{value}</Tag>,
    },
    {
      title: "Withholding Tax Payable",
      dataIndex: "withholdingTax",
      render: (value, { isDisabledWithholdingTax }) => {
        return isDisabledWithholdingTax ? (
          "Disabled Withholding Tax"
        ) : (
          <NumeralFormatter value={value} />
        );
      },
    },
    ...(payroll?.status === PayrollStatus.Active ? actionColumn : []),
  ];

  return (
    <>
      <PayrollHeader
        module={PayrollModule.WithholdingTax}
        status={payroll?.status as string}
        showTitle
        // handleClickFinalize={handleClickFinalize}
        loading={loadingPayrollEmployees}
        extra={
          payroll?.timekeeping?.status === PayrollStatus.Finalized &&
          payroll?.contribution?.status === PayrollStatus.Finalized && (
            <>
              <CustomButton
                icon={<ReloadOutlined />}
                onClick={() => confirmRecalculate()}
                danger
                type="primary"
              >
                Recalculate all employee withholding tax
              </CustomButton>
            </>
          )
        }
      />

      {payroll?.timekeeping?.status === PayrollStatus.Finalized &&
      payroll?.contribution?.status === PayrollStatus.Finalized ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              width: "100%",
            }}
          >
            <div style={{ width: "80%", marginRight: 10 }}>
              <PayrollEmployeeFilter
                onQueryChange={onQueryChange}
                withItems={false}
              />
            </div>
          </div>
          <TablePaginated
            columns={columns}
            loading={loadingPayrollEmployees || loadingUpdateStatus}
            size={"small"}
            dataSource={employees}
            total={totalElements}
            pageSize={state.size}
            onChangePagination={onNextPage}
            current={state.page}
            rowKey={(record: any) => {
              return record?.id;
            }}
          />
        </>
      ) : (
        <Empty description="Timekeeping and Contribution must be FINALIZED first before proceeding with Withholding Tax" />
      )}
    </>
  );
}

export default WithholdingTax;
