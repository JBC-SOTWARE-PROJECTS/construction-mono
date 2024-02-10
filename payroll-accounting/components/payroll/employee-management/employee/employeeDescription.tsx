import { Employee } from "@/graphql/gql/graphql";
import { Descriptions, DescriptionsProps } from "antd";
import React from "react";

type Props = {
  record: Employee;
};

function EmployeeDescription({ record }: Props) {
  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Assigned Office",
      children: record?.office?.officeDescription,
    },
    {
      key: "2",
      label: "Employement Status",
      children: record?.employeeType,
    },
    {
      key: "3",
      label: "Mobile",
      children: record?.employeeCelNo,
    },
    {
      key: "4",
      label: "Email",
      children: record?.emailAddress,
    },
    {
      key: "5",
      label: "Address",
      children: record?.fullAddress,
    },
  ];

  return (
    <div>
      <Descriptions title="User Info" items={items} column={2} />
    </div>
  );
}

export default EmployeeDescription;
