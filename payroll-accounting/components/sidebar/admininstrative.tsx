import { TDiverseTradeMenu } from "@/utility/interfaces";
import {
  AppstoreAddOutlined,
  ControlOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

const administrativeMenu: TDiverseTradeMenu[] = [
  {
    title: "Company List Management Hub",
    subtitle: "Streamline and manage your list of companies effortlessly.",
    icon: <AppstoreAddOutlined className="diverse-trade-icon" />,
    path: "/administrative/companies",
  },
  {
    title: "Office Configuration Hub",
    subtitle: "Seamlessly manage and configure your list of offices.",
    icon: <HomeOutlined className="diverse-trade-icon" />,
    path: "/administrative/offices",
  },
  {
    title: "Job Designation Optimization",
    subtitle: "Optimize your position list for coherent job designations.",
    icon: <ControlOutlined className="diverse-trade-icon" />,
    path: "/administrative/positions",
  },
  {
    title: "Employee Database Center",
    subtitle: "Effortlessly manage and maintain your list of employees.",
    icon: <UsergroupAddOutlined className="diverse-trade-icon" />,
    path: "/administrative/employees",
  },
];

export default administrativeMenu;
