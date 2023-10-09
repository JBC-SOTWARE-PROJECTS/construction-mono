import EmployeeManagementHeader from "@/components/administrative/employees/EmployeeManagementHeader";
import EmployeeDetails from "@/components/common/EmployeeDetails";
import AccumulatedLogs from "@/components/payroll/employee-management/attendance/AccumulatedLogs";
import RawLogs from "@/components/payroll/employee-management/attendance/RawLogs";
import { useGetEmployeeById } from "@/hooks/employee";
import type { TabsProps } from "antd";
import { Divider, Tabs } from "antd";
import { useRouter } from "next/router";

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Accumulated Logs",
    children: <AccumulatedLogs />,
  },
  {
    key: "2",
    label: "Raw Attendance Logs",
    children: <RawLogs />,
  },
];
function EmployeeSchedulePage() {
  const router = useRouter();
  const [employee, loadingEmployee] = useGetEmployeeById(router?.query?.id);

  return (
    <>
      <EmployeeManagementHeader title="Employee Attendance">
        <EmployeeDetails
          fullName={employee?.fullName}
          position={employee?.position?.description}
        />
      </EmployeeManagementHeader>

      <Divider />
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </>
  );
}

export default EmployeeSchedulePage;
