import EmployeeDetails from "@/components/common/EmployeeDetails";
import CashAdvance from "@/components/payroll/employee-management/loans/CashAdvance";
import EquipmentLoan from "@/components/payroll/employee-management/loans/EquipmentLoan";
import LoansLedger from "@/components/payroll/employee-management/loans/LoansLedger";
import { PageHeader } from "@ant-design/pro-components";
import type { TabsProps } from "antd";
import { Divider, Tabs } from "antd";
import { useRouter } from "next/router";

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Cash Advance",
    children: <CashAdvance />,
  },
  {
    key: "2",
    label: "Equipment Loan",
    children: <EquipmentLoan />,
  },
  {
    key: "3",
    label: "Ledger",
    children: <LoansLedger />,
  },
];
function EmployeeLoansPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader onBack={() => router?.back()} title="Employee Loans">
        <EmployeeDetails fullName={"fuck"} position="you" />
      </PageHeader>

      <Divider />
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </>
  );
}

export default EmployeeLoansPage;
