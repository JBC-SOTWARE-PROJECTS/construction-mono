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
  PayrollEmployeeStatus,
  PayrollModule,
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
import { Divider, Modal, Spin, Tag } from "antd";
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
    if (countDraft > 0) {
      Modal.confirm({
        title: "There still some DRAFT employees. Proceed?",
        icon: <ExclamationCircleOutlined />,
        onOk() {
          updateStatus({
            payrollId: router?.query?.id as string,
            status: "FINALIZED",
          });
        },
      });
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
        extra={
          <>
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
            <CustomButton
              type="primary"
              icon={
                timekeeping?.status === "FINALIZED" ? (
                  <EditOutlined />
                ) : (
                  <CheckOutlined />
                )
              }
              onClick={handleClickFinalize}
            >
              Set as {statusMap[timekeeping?.status]}
            </CustomButton>

            {timekeeping?.status === "FINALIZED" && (
              <LogsProjectBreakdownModal
                record={{ projectBreakdown: timekeeping?.projectBreakdown }}
                disabled={false}
              >
                View Project Breakdown
              </LogsProjectBreakdownModal>
            )}
          </>
        }
      />
      <Divider />
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
              )}

              {displayedEmployee?.status === "FINALIZED" && (
                <LogsProjectBreakdownModal
                  record={{
                    projectBreakdown: displayedEmployee?.projectBreakdown,
                  }}
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

      <AccumulatedLogsTable
        displayedEmployee={displayedEmployee}
        isTimekeeping
        showBreakdown
        refetch={refetch}
        dataSource={data}
        loading={loadingPayrollEmployees || loading}
      />
    </Spin>
  );
}

export default Timekeeping;
