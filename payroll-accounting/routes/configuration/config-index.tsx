import React from "react";
import Sidebar from "@/components/common/sideBar";
import { UserOutlined } from "@ant-design/icons";
import SalaryRateConfig from "./salary-rate-config";

const SalaryRateConfiguration = [
  {
    path: "salary-rate-config",
    icon: <UserOutlined />,
    label: "Salary Rate Config ",
    content: <SalaryRateConfig />,
  },
];

const ConfigIndex: React.FC = () => {
  return (
    <div>
      <Sidebar menuItems={SalaryRateConfiguration} />
    </div>
  );
};

export default ConfigIndex;
