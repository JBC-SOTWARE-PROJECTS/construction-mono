import { TDiverseTradeMenu } from "@/utility/interfaces";
import {
  CalendarOutlined,
  CarryOutOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const payrollmenu: TDiverseTradeMenu[] = [
  {
    title: "Configurations",
    subtitle: "Manage configurations for the payroll module.",
    icon: <SettingOutlined className="diverse-trade-icon" />,
    path: "/payroll/configurations/schedule-types",
  },
  {
    title: "Employee Management",
    subtitle: "Manage employee work schedule and attendance",
    icon: <CalendarOutlined className="diverse-trade-icon" />,
    path: "/payroll/employee-management/work-schedule",
  },
  {
    title: "Payroll Management",
    subtitle: "View and manage payroll",
    icon: <CalendarOutlined className="diverse-trade-icon" />,
    path: "/payroll/payroll-management",
  },
];

export default payrollmenu;
