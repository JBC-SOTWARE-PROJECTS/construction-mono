import EmployeeManagementHeader from "@/components/administrative/employees/EmployeeManagementHeader";
import EmployeeDetails from "@/components/common/EmployeeDetails";
import UpsertEmployeeAllowanceModal from "@/components/payroll/employee-management/allowance/UpsertEmployeeAllowanceModal";
import { EmployeeAllowance } from "@/graphql/gql/graphql";
import useGetEmployeeAllowanceItems from "@/hooks/employee-allowance/useGetEmployeeAllowanceItems";
import NumeralFormatter from "@/utility/numeral-formatter";
import { Table } from "antd";

import { useRouter } from "next/router";

function EmployeeAllowancePage() {
  const router = useRouter();
  const [employee, loadingEmployee] = useGetEmployeeAllowanceItems(
    router?.query?.id
  );
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value: any) => (
        <NumeralFormatter format={"0,0.[00]"} value={value} />
      ),
    },
    {
      title: "Allowance Type",
      dataIndex: "allowanceType",
    },
  ];
  return (
    <div>
      <EmployeeManagementHeader title="Allowance">
        <EmployeeDetails
          fullName={employee?.fullName}
          position={employee?.position?.description}
          loading={loadingEmployee}
        />
      </EmployeeManagementHeader>
      <UpsertEmployeeAllowanceModal />
      <Table
        columns={columns}
        dataSource={employee?.allowanceItems}
        // loading={loading || loadingUpsert}
        // onChange={onNextPage}
      />
    </div>
  );
}

export default EmployeeAllowancePage;
