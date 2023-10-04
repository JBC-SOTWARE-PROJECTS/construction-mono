import CustomButton from "@/components/common/CustomButton";
import AccumulatedLogsTable from "@/components/payroll/AccumulatedLogsTable";
import EmployeeDrawer from "@/components/payroll/EmployeeDrawer";
import PayrollHeader from "@/components/payroll/PayrollHeader";
import PayrollEmployeeStatusAction from "@/components/payroll/payroll-management/PayrollEmployeeStatusAction";
import PayrollModuleRecalculateAllEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateAllEmployeeAction";
import PayrollModuleRecalculateEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateEmployeeAction";
import {
  Employee,
  PayrollModule,
  TimekeepingEmployeeDto,
} from "@/graphql/gql/graphql";
import useGetTimekeepingEmployeeLogs from "@/hooks/payroll/timekeeping/useGetTimekeepingEmployeeLogs";
import useGetTimekeepingEmployees from "@/hooks/payroll/timekeeping/useGetTimekeepingEmployees";
import { getStatusColor } from "@/utility/helper";
import { IPageProps } from "@/utility/interfaces";
import { CheckOutlined, ReloadOutlined } from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-components";
import { Divider, Tag } from "antd";
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

  return (
    <div>
      <PayrollHeader
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
            <CustomButton type="primary" icon={<CheckOutlined />}>
              Finalize Timekeeping
            </CustomButton>
          </>
        }
      />
      <Divider />
      <PageHeader
        extra={
          <EmployeeDrawer
            selectedEmployees={selectedEmployees as Employee[]}
            loading={loadingPayrollEmployees}
            setDisplayedEmployee={setDisplayedEmployee}
            usage="TIMEKEEPING"
          />
        }
        title={
          displayedEmployee ? (
            <>
              <table
                style={{
                  fontSize: 16,
                  color: "initial",
                  margin: 10,
                  marginBottom: 0,
                }}
              >
                <tr>
                  <td>Name:</td>
                  <td style={{ paddingLeft: 10 }}>
                    {displayedEmployee?.fullName}{" "}
                    <Tag
                      color={getStatusColor(
                        displayedEmployee?.status as string
                      )}
                    >
                      {displayedEmployee?.status}
                    </Tag>
                  </td>
                </tr>
                <tr>
                  <td>Position:</td>
                  <td style={{ paddingLeft: 10 }}>
                    {displayedEmployee?.position?.description}
                  </td>
                </tr>
              </table>
              <PayrollModuleRecalculateEmployeeAction
                id={displayedEmployee?.id}
                module={PayrollModule.Timekeeping}
                buttonProps={{
                  danger: true,
                  ghost: true,
                  icon: <ReloadOutlined />,
                }}
                refetch={refetch}
                allowedPermissions={["recalculate_one_contributions_employee"]}
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
                displayedEmployee?.status === "DRAFT" ? "Finalized" : "Draft"
              }`}</PayrollEmployeeStatusAction>
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
    </div>
  );
}

export default Timekeeping;
