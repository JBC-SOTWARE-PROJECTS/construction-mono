import EmployeeManagementHeader from "@/components/administrative/employees/EmployeeManagementHeader";
import EmployeeDetails from "@/components/common/EmployeeDetails";
import CashAdvance from "@/components/payroll/employee-management/loans/CashAdvance";
import EquipmentLoan from "@/components/payroll/employee-management/loans/EquipmentLoan";
import LoansLedger from "@/components/payroll/employee-management/loans/LoansLedger";
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
    label: "Ledger",
    children: <LoansLedger />,
  },
  {
    key: "2",
    label: "Cash Advance",
    children: <CashAdvance />,
  },
  {
    key: "3",
    label: "Equipment Loan",
    children: <EquipmentLoan />,
  },
];
function EmployeeLoansPage() {
  const router = useRouter();
  const [employee, loadingEmployee] = useGetEmployeeById(router?.query?.id);

  return (
    <>
      <EmployeeManagementHeader title="Employee Loans">
        <EmployeeDetails
          fullName={employee?.fullName}
          position={employee?.position?.description}
          loading={loadingEmployee}
        />
      </EmployeeManagementHeader>

      <Divider />
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </>
  );
}

export default EmployeeLoansPage;
