import { IPageProps } from "@/utility/interfaces";
import { Alert, Divider } from "antd";
import React from "react";

export default function MainMenu({ account }: IPageProps) {
  return (
    <div className="w-full">
      <Alert
        message={`Welcome back ${account.fullName}! 🎉`}
        description={`We're delighted to see you again and have the 
        opportunity to continue supporting you. Your engagement is what drives us, 
        and we're committed to making your experience here at DiverseTrade Suite 
        truly exceptional. As you navigate through this session, remember that you're 
        current company is ${account.office.officeDescription}`}
        type="info"
        showIcon
      />
      <Divider orientation="left">Inventory Module</Divider>
      <Divider orientation="left">Accounting Module</Divider>
      <Divider orientation="left">Payroll Module</Divider>
      <Divider orientation="left">Administrative Module</Divider>
    </div>
  );
}
