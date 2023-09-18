import { Tag, TagProps } from "antd";
import React from "react";
export const payrollEmployeeStatusColorGenerator = (value: string) => {
  switch (value) {
    case "DRAFT":
      return "orange";
    case "FINALIZED":
      return "blue";
    case "REJECTED":
      return "red";
    case "APPROVED":
      return "green";
  }
};
interface IProps extends TagProps {
  status: string;
}

function PayrollEmployeeStatusTag({ status, ...props }: IProps) {
  return (
    <Tag {...props} color={payrollEmployeeStatusColorGenerator(status)}>
      {status}
    </Tag>
  );
}

export default PayrollEmployeeStatusTag;
