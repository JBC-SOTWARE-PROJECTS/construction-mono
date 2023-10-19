import EmployeeManagementHeader from "@/components/administrative/employees/EmployeeManagementHeader";
import EmployeeDetails from "@/components/common/EmployeeDetails";
import UpsertEmployeeLeaveModal from "@/components/payroll/employee-management/leave/UpsertEmployeeLeaveModal";
import CashAdvance from "@/components/payroll/employee-management/loans/CashAdvance";
import EquipmentLoan from "@/components/payroll/employee-management/loans/EquipmentLoan";
import LoanConfiguration from "@/components/payroll/employee-management/loans/LoanConfiguration";
import LoansLedger from "@/components/payroll/employee-management/loans/LoansLedger";
import { useGetEmployeeById } from "@/hooks/employee";
import type { TabsProps } from "antd";
import { Divider, Tabs } from "antd";
import { useRouter } from "next/router";

function EmployeeLoansPage() {
  const router = useRouter();
  const [employee, loadingEmployee] = useGetEmployeeById(router?.query?.id);
  // const column

  return (
    <>
      <EmployeeManagementHeader title="Leave">
        <EmployeeDetails
          fullName={employee?.fullName}
          position={employee?.position?.description}
          loading={loadingEmployee}
        />
      </EmployeeManagementHeader>
      <UpsertEmployeeLeaveModal />
      <Divider />
    </>
  );
}

export default EmployeeLoansPage;
