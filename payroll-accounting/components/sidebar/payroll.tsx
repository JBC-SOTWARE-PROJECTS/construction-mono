import { TDiverseTradeMenu } from "@/utility/interfaces";
import { SettingOutlined } from "@ant-design/icons";

const administrativeMenu: TDiverseTradeMenu[] = [
  {
    title: "Configurations",
    subtitle: "Manage configurations for the payroll module.",
    icon: <SettingOutlined className="diverse-trade-icon" />,
    path: "/payroll/configurations/schedule-types",
  },
  {
    title: "Employee Attendance",
    subtitle: "Manage configurations for the payroll module.",
    icon: <SettingOutlined className="diverse-trade-icon" />,
    path: "/payroll/attendance/upload-biometric",
  },
];

export default administrativeMenu;
