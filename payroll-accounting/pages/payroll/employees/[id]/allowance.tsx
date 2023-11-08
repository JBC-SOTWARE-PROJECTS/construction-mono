import EmployeeManagementHeader from "@/components/administrative/employees/EmployeeManagementHeader";
import EmployeeDetails from "@/components/common/EmployeeDetails";
import UpsertEmployeeAllowanceModal from "@/components/payroll/employee-management/allowance/UpsertEmployeeAllowanceModal";
import { Employee } from "@/graphql/gql/graphql";
import useEditEmployeeAllowanceAmount from "@/hooks/employee-allowance/useEditEmployeeAllowanceAmount";
import useGetEmployeeAllowanceItems from "@/hooks/employee-allowance/useGetEmployeeAllowanceItems";
import NumeralFormatter from "@/utility/numeral-formatter";
import { EditOutlined } from "@ant-design/icons";
import { InputNumber, Table } from "antd";

import { useRouter } from "next/router";
import { useRef, useState } from "react";

function EmployeeAllowancePage() {
  const router = useRouter();
  const [editingKey, setEditingKey] = useState();
  const [editingField, setEditingField] = useState<string | undefined>();
  const [employee, loadingEmployee, refetch] = useGetEmployeeAllowanceItems(
    router?.query?.id
  );
  const amountRef = useRef<any>();
  const [updateAmount, loadingUpdateAmount] = useEditEmployeeAllowanceAmount(
    () => {
      refetch();
    }
  );

  const resetEditing = () => {
    setEditingField(undefined);
    setEditingKey(undefined);
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value: any, record: Employee) =>
        editingKey === record.id && editingField === "amount" ? (
          <InputNumber
            size="small"
            id="editable-amount"
            autoFocus
            onBlur={() => {
              updateAmount({
                id: record.id,
                amount: amountRef?.current?.value,
              });
              resetEditing();
            }}
            ref={amountRef}
            defaultValue={value}
          />
        ) : (
          <div
            onClick={() => {
              setEditingKey(record.id);
              setEditingField("amount");
            }}
          >
            <NumeralFormatter format={"0,0.[00]"} value={value} />{" "}
            <EditOutlined />
          </div>
        ),
    },
    {
      title: "Allowance Type",
      dataIndex: "allowanceType",
      render: (value: string) => value?.replace("_", " "),
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
      <UpsertEmployeeAllowanceModal
        allowancePackageId={employee?.allowancePackageId}
        refetch={refetch}
        employeeAllowanceItems={employee?.allowanceItems}
      />
      <br />
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
