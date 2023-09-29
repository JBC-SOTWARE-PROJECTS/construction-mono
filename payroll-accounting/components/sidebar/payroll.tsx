import { TDiverseTradeMenu } from "@/utility/interfaces";
import {
  CalendarOutlined,
  CarryOutOutlined,
  SettingOutlined,
  MoneyCollectOutlined,
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
  {
    title: "Allowance Management",
    subtitle: "Manage configuration for allowance management",
    icon: <MoneyCollectOutlined className="diverse-trade-icon" />,
    path: "/payroll/allowance-management/allowance-type",
  },
];

export default payrollmenu;
