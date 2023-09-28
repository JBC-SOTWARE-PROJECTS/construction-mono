import CustomButton from "@/components/common/CustomButton";
import AccumulatedLogsTable from "@/components/payroll/AccumulatedLogsTable";
import EmployeeDrawer from "@/components/payroll/EmployeeDrawer";
import PayrollHeader from "@/components/payroll/PayrollHeader";
import PayrollModuleRecalculateAllEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateAllEmployeeAction";
import PayrollModuleRecalculateEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateEmployeeAction";
import { Employee, PayrollModule } from "@/graphql/gql/graphql";
import useGetTimekeepingEmployeeLogs from "@/hooks/payroll/timekeeping/useGetTimekeepingEmployeeLogs";
import useGetTimekeepingEmployees from "@/hooks/payroll/timekeeping/useGetTimekeepingEmployees";
import { IPageProps } from "@/utility/interfaces";
import { CheckOutlined, ReloadOutlined } from "@ant-design/icons";
import { Key, PageHeader } from "@ant-design/pro-components";
import { Divider } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";

function Timekeeping({ account }: IPageProps) {
  const router = useRouter();
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [selectedIds, setSelectedIds] = useState<Key[]>([]);
  const [displayedEmployee, setDisplayedEmployee] = useState<Employee>();
  const [_, loadingPayrollEmployees] = useGetTimekeepingEmployees((result) => {
    let ids: Key[] = [];
    result.forEach((item: Employee) => {
      ids.push(item.id);
    });
    setSelectedIds(ids);
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
              refetch={refetch}
              // allowedPermissions={['recalculate_all_contributions_employees']}
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
            selectedEmployees={selectedEmployees}
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
                    {displayedEmployee?.fullName}
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
            </>
          ) : (
            "Please Select an Employee"
          )
        }
      />

      <AccumulatedLogsTable
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
