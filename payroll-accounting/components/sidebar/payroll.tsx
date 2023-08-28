import { TDiverseTradeMenu } from "@/utility/interfaces";
import {
  CalendarOutlined,
  CarryOutOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const administrativeMenu: TDiverseTradeMenu[] = [
  {
    title: "Configurations",
    subtitle: "Manage configurations for the payroll module.",
    icon: <SettingOutlined className="diverse-trade-icon" />,
    path: "/payroll/configurations/schedule-types",
  },
  {
    title: "Attendance",
    subtitle: "View and manage employee attendance",
    icon: <CarryOutOutlined className="diverse-trade-icon" />,
    path: "/payroll/attendance/upload-biometric",
  },
  {
    title: "Work Schedule",
    subtitle: "View and manage employee work schedule",
    icon: <CalendarOutlined className="diverse-trade-icon" />,
    path: "/payroll/employee-schedule",
  },
];

export default administrativeMenu;
