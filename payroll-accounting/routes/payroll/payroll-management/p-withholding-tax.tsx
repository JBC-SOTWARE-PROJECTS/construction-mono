import PayrollHeader from "@/components/payroll/PayrollHeader";
import { PayrollEmployeeFilter } from "@/components/payroll/payroll-management/PayrollEmployeeFilter";
import PayrollEmployeeStatusAction from "@/components/payroll/payroll-management/PayrollEmployeeStatusAction";
import PayrollModuleRecalculateEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateEmployeeAction";
import {
  PayrollEmployeeOtherDeductionDto,
  PayrollEmployeeStatus,
  PayrollModule,
} from "@/graphql/gql/graphql";
import { variables } from "@/hooks/payroll/contributions/useGetContributionEmployees";
import useGetPayrollEmployeeOtherDeduction from "@/hooks/payroll/other-deductions/useGetPayrollEmployeeOtherDeduction";
import useGetPayrollOtherDeduction from "@/hooks/payroll/other-deductions/useGetPayrollOtherDeduction";
import useUpdatePayrollOtherDeductionStatus from "@/hooks/payroll/other-deductions/useUpdatePayrollOtherDeductionStatus";
import useGetPayrollHRMEmployees from "@/hooks/payroll/useGetPayrollHRMEmployees";
import { PayrollStatus } from "@/hooks/payroll/useUpdatePayrollStatus";
import usePaginationState from "@/hooks/usePaginationState";
import { statusMap } from "@/utility/constant";
import { getStatusColor } from "@/utility/helper";
import { IPageProps } from "@/utility/interfaces";
import NumeralFormatter from "@/utility/numeral-formatter";
import { Modal, Space, Tag, message } from "antd";
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
const initialState: variables = {
  filter: "",
  size: 25,
  page: 0,
  status: [],
};
function WithholdingTax({ account }: IPageProps) {
  const router = useRouter();
  const [state, { onQueryChange }] = usePaginationState(initialState, 0, 25);

  const [employees, loadingPayrollEmployees, refetch] =
    useGetPayrollEmployees();

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
  const actionColumn: ColumnsType<PayrollEmployeeOtherDeductionDto> = [
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

  const columns: ColumnsType<PayrollEmployeeOtherDeductionDto> = [
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
      render: (value) => {
        return <NumeralFormatter value={value} />;
      },
    },
    ...(payroll?.status === PayrollStatus.ACTIVE ? actionColumn : []),
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
      </div>

      <Table
        columns={columns}
        loading={false}
        size={"small"}
        dataSource={employees}
        onChange={onQueryChange}
        rowKey={(record: any) => {
          return record?.id;
        }}
      />
    </>
  );
}

export default WithholdingTax;
