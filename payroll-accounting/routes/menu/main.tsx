import { IPageProps } from "@/utility/interfaces";
import { Alert, Divider } from "antd";
import React from "react";
import logo from "@/public/images/DTLogo.png";
import MenuCard from "@/components/menuCard";
import administrativeMenu from "@/components/sidebar/admininstrative";

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
        type="success"
        showIcon
        icon={<img src={logo.src} className="diverse-trade" />}
      />
      <Divider orientation="left">Inventory Module</Divider>
      <div className="w-full">
        <MenuCard menus={[]} />
      </div>
      <Divider orientation="left">Accounting Module</Divider>
      <div className="w-full">
        <MenuCard menus={[]} />
      </div>
      <Divider orientation="left">Payroll Module</Divider>
      <div className="w-full">
        <MenuCard menus={[]} />
      </div>
      <Divider orientation="left">Administrative Module</Divider>
      <div className="w-full">
        <MenuCard menus={administrativeMenu} />
      </div>
    </div>
  );
}
