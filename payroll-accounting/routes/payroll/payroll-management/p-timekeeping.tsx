import CustomButton from "@/components/common/CustomButton";
import EmployeeDetails from "@/components/common/EmployeeDetails";
import AccumulatedLogsTable from "@/components/payroll/AccumulatedLogsTable";
import EmployeeDrawer from "@/components/payroll/EmployeeDrawer";
import LogsProjectBreakdownModal from "@/components/payroll/LogsProjectBreakdownModal";
import PayrollHeader from "@/components/payroll/PayrollHeader";
import PayrollEmployeeStatusAction from "@/components/payroll/payroll-management/PayrollEmployeeStatusAction";
import PayrollModuleRecalculateAllEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateAllEmployeeAction";
import PayrollModuleRecalculateEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateEmployeeAction";
import {
  Employee,
  EmployeeSalaryDto,
  PayrollEmployeeStatus,
  PayrollModule,
  PayrollStatus,
  TimekeepingEmployeeDto,
} from "@/graphql/gql/graphql";
import useGetTimekeeping from "@/hooks/payroll/timekeeping/useGetTimekeeping";
import useGetTimekeepingEmployeeLogs from "@/hooks/payroll/timekeeping/useGetTimekeepingEmployeeLogs";
import useGetTimekeepingEmployees from "@/hooks/payroll/timekeeping/useGetTimekeepingEmployees";
import useUpdateTimekeepingStatus from "@/hooks/payroll/timekeeping/useUpdateTimekeepingStatus";
import { statusMap } from "@/utility/constant";
import { getStatusColor } from "@/utility/helper";
import { IPageProps } from "@/utility/interfaces";
import {
  CheckOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-components";
import { Empty, Modal, Space, Spin, Tag, Typography, message } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";

function Timekeeping({ account }: IPageProps) {
  const router = useRouter();
  const [selectedEmployees, setSelectedEmployees] = useState<
    TimekeepingEmployeeDto[]
  >([]);

  const [displayedEmployee, setDisplayedEmployee] =
    useState<TimekeepingEmployeeDto>();

  const [_, loadingPayrollEmployees, refetchEmployees] =
    useGetTimekeepingEmployees((result) => {
      result.forEach((item: TimekeepingEmployeeDto) => {
        if (item?.id === displayedEmployee?.id) setDisplayedEmployee(item);
      });
      setSelectedEmployees(result);
    });

  const [data, loading, refetch] = useGetTimekeepingEmployeeLogs(
    displayedEmployee?.id
  );
  const [timekeeping, loadingTimekeeping, refetchTimekeeping] =
    useGetTimekeeping();

  const [updateStatus, loadingUpdateStatus] = useUpdateTimekeepingStatus(() => {
    refetchTimekeeping();
    refetchEmployees();
  });

  const handleClickFinalize = () => {
    let countDraft = 0;
    selectedEmployees.forEach((item) => {
      if (item.status === PayrollEmployeeStatus.Draft) countDraft++;
    });
    if (countDraft > 0 && timekeeping.status === "DRAFT") {
      message.error(
        "There are still some DRAFT employees. Please finalize all employees first"
      );
    } else {
      updateStatus({
        payrollId: router?.query?.id as string,
        status: statusMap[timekeeping?.status],
      });
    }
  };
  return (
    <Spin spinning={loadingTimekeeping || loadingUpdateStatus}>
      <PayrollHeader
        showTitle
        status={timekeeping?.status}
        module={PayrollModule.Timekeeping}
        handleClickFinalize={handleClickFinalize}
        loading={loadingUpdateStatus}
        extra={
          <Space>
            {timekeeping?.status === "DRAFT" && (
              <PayrollModuleRecalculateAllEmployeeAction
                id={router?.query?.id as string}
                module={PayrollModule.Timekeeping}
                buttonProps={{
                  shape: "circle",
                  icon: <ReloadOutlined />,
                  type: "primary",
                  danger: true,
                }}
                tooltipProps={{ placement: "topRight" }}
                refetch={() => {
                  refetch();
                  refetchEmployees();
                }}
              />
            )}

            {timekeeping?.status === "FINALIZED" && (
              <LogsProjectBreakdownModal
                record={{ projectBreakdown: timekeeping?.projectBreakdown }}
                salaryBreakdown={timekeeping?.salaryBreakdown}
                disabled={false}
              >
                View Project Breakdown
              </LogsProjectBreakdownModal>
            )}
          </Space>
        }
      />
      <PageHeader
        extra={
          <EmployeeDrawer
            selectedEmployees={selectedEmployees as Employee[]}
            loading={loadingPayrollEmployees}
            onSelect={setDisplayedEmployee}
            usage="TIMEKEEPING"
          >
            Select Employee
          </EmployeeDrawer>
        }
        title={
          displayedEmployee ? (
            <>
              <EmployeeDetails
                fullName={
                  <>
                    {displayedEmployee?.fullName}{" "}
                    <Tag
                      color={getStatusColor(
                        displayedEmployee?.status as string
                      )}
                    >
                      {displayedEmployee?.status}
                    </Tag>
                  </>
                }
                position={displayedEmployee?.position?.description as string}
              />
              {timekeeping?.status === "DRAFT" && (
                <>
                  {" "}
                  {displayedEmployee?.status === "DRAFT" && (
                    <PayrollModuleRecalculateEmployeeAction
                      id={displayedEmployee?.id}
                      module={PayrollModule.Timekeeping}
                      buttonProps={{
                        danger: true,
                        ghost: true,
                        icon: <ReloadOutlined />,
                      }}
                      refetch={refetch}
                      allowedPermissions={[
                        "recalculate_one_contributions_employee",
                      ]}
                    >
                      Recalculate Employee
                    </PayrollModuleRecalculateEmployeeAction>
                  )}
                  <PayrollEmployeeStatusAction
                    id={displayedEmployee?.id}
                    module={PayrollModule.Timekeeping}
                    value={displayedEmployee?.status}
                    buttonProps={{ type: "primary" }}
                    refetch={refetchEmployees}
                  >{`Set as ${
                    displayedEmployee?.status === "DRAFT"
                      ? "Finalized"
                      : "Draft"
                  }`}</PayrollEmployeeStatusAction>
                </>
              )}{" "}
              {displayedEmployee?.status === "FINALIZED" && (
                <LogsProjectBreakdownModal
                  record={{
                    projectBreakdown: displayedEmployee?.projectBreakdown,
                  }}
                  salaryBreakdown={
                    displayedEmployee?.salaryBreakdown as EmployeeSalaryDto[]
                  }
                  disabled={false}
                >
                  View Project Breakdown
                </LogsProjectBreakdownModal>
              )}
            </>
          ) : (
            "Please Select an Employee"
          )
        }
      />
      {displayedEmployee?.isExcludedFromAttendance ? (
        <Empty
          description={
            <Typography.Title level={4}>
              This employee is excluded from attendance
            </Typography.Title>
          }
        />
      ) : displayedEmployee ? (
        <AccumulatedLogsTable
          displayedEmployee={displayedEmployee}
          isTimekeeping
          showBreakdown
          refetch={refetch}
          dataSource={data}
          loading={loadingPayrollEmployees || loading}
        />
      ) : (
        <Empty
          description={
            <Typography.Title level={4}>No Employee Selected</Typography.Title>
          }
        />
      )}
    </Spin>
  );
}

export default Timekeeping;
