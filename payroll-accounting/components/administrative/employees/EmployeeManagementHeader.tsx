import EmployeeDrawer from "@/components/payroll/EmployeeDrawer";
import { Employee } from "@/graphql/gql/graphql";
import useGetEmployeesBasic from "@/hooks/employee/useGetEmployeesBasic";
import { SwapOutlined } from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-components";
import { Space } from "antd";
import { useRouter } from "next/router";
import React from "react";
interface IParams {
  title?: string;
  children?: any;
}

function EmployeeManagementHeader({ title, children }: IParams) {
  const router = useRouter();
  const [employeeList, loading] = useGetEmployeesBasic();

  return (
    <PageHeader
      onBack={() => router.push(`/payroll/employees/${router?.query?.id}`)}
      title={title || ""}
      extra={
        <EmployeeDrawer
          selectedEmployees={employeeList as Employee[]}
          loading={false}
          usage="EMPLOYEE_SWITCHING"
          icon={<SwapOutlined />}
          onSelect={(employee) => {
            console.log(
              router.push({
                pathname: router?.pathname,
                query: { id: employee?.id },
              })
            );
          }}
          selectedRowKeys={[router?.query?.id] as string[]}
        >
          Switch Employee
        </EmployeeDrawer>
      }
    >
      {children}
    </PageHeader>
  );
}

export default EmployeeManagementHeader;
