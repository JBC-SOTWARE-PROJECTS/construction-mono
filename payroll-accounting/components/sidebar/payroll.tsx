import { TDiverseTradeMenu } from "@/utility/interfaces";
import { SettingOutlined } from "@ant-design/icons";

const payrollmenu: TDiverseTradeMenu[] = [
  {
    title: "Configurations",
    subtitle: "Manage configurations for the payroll module.",
    icon: <SettingOutlined className="diverse-trade-icon" />,
    path: "/payroll/configurations/schedule-types",
  },
];

export default payrollmenu;
