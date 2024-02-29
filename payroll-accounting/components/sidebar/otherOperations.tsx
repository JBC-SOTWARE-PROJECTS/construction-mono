import { TDiverseTradeMenu } from "@/utility/interfaces";
import {
  CarOutlined,
} from "@ant-design/icons";

const otherOperationsMenu: TDiverseTradeMenu[] = [
  {
    title: "Motorpool",
    subtitle: "Monitor and manage vehicle operations",
    icon: <CarOutlined className="diverse-trade-icon" />,
    path: "/inventory/assets/masterfile/all",
  }
];

export default otherOperationsMenu;
