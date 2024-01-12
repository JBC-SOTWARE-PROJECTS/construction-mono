import { frontEndUrl } from "@/shared/settings";
import { TDiverseTradeMenu } from "@/utility/interfaces";
import {
  BarcodeOutlined,
  ShoppingCartOutlined,
  FileDoneOutlined,
  ShoppingOutlined,
  ApiOutlined,
  BookOutlined,
  InteractionOutlined,
  InsertRowBelowOutlined,
  TableOutlined,
  WalletOutlined,
  ProjectOutlined,
  CarOutlined,
} from "@ant-design/icons";

const invetoryMenu: TDiverseTradeMenu[] = [
  {
    title: "Item Masterfile and Configuration",
    subtitle:
      "Mastering Your Inventory: Configuration and Optimization of Item Masterfile.",
    icon: <FileDoneOutlined className="diverse-trade-icon" />,
    path: "/inventory/masterfile/items/all",
  },
  {
    title: "Purchase Request and Orders",
    subtitle:
      "From Request to Receipt: Enhancing Inventory Control with Purchase Requests and Orders.",
    icon: <ShoppingOutlined className="diverse-trade-icon" />,
    path: `${frontEndUrl}/main/transactions/pr`,
    customPath: true,
  },
  {
    title: "Delivery Receiving  and Returns",
    subtitle:
      "Navigating the Inventory Lifecycle: Streamlining Delivery Receiving and Returns for Maximum Efficiency.",
    icon: <ShoppingCartOutlined className="diverse-trade-icon" />,
    path: `${frontEndUrl}/main/transactions/dr`,
    customPath: true,
  },
  {
    title: "Item Issuances and Expense",
    subtitle:
      "Efficient Inventory Utilization: Mastering Item Issuances and Expense Tracking.",
    icon: <InteractionOutlined className="diverse-trade-icon" />,
    path: `${frontEndUrl}/main/transactions/issuances`,
    customPath: true,
  },
  {
    title: "Material Production (Repacking)",
    subtitle: "Smart Repacking: Streamlining Material Production in Inventory.",
    icon: <ApiOutlined className="diverse-trade-icon" />,
    path: `${frontEndUrl}/main/transactions/mp`,
    customPath: true,
  },
  {
    title: "Quantity Adjustments",
    subtitle: "Fine-Tuning Inventory: Easy Steps for Quantity Adjustments.",
    icon: <InsertRowBelowOutlined className="diverse-trade-icon" />,
    path: `${frontEndUrl}/main/transactions/adjustments`,
    customPath: true,
  },
  {
    title: "Setup Beginning Balances",
    subtitle: "Inventory Head Start: Easy Beginning Balance Configuration.",
    icon: <TableOutlined className="diverse-trade-icon" />,
    path: `${frontEndUrl}/main/transactions/bc`,
    customPath: true,
  },
  {
    title: "Markup and Cost Control",
    subtitle:
      "Profit Optimization: Simplified Markup and Cost Control in Inventory.",
    icon: <WalletOutlined className="diverse-trade-icon" />,
    path: `${frontEndUrl}/main/transactions/markup`,
    customPath: true,
  },
  {
    title: "Inventory Monitoring",
    subtitle:
      "Inventory Oversight: Simplifying Monitoring for Better Management.",
    icon: <BarcodeOutlined className="diverse-trade-icon" />,
    path: "/inventory/monitoring",
  },
  {
    title: "Project Management",
    subtitle: "Task Tracker: Easy Project Management for Productive Teams.",
    icon: <ProjectOutlined className="diverse-trade-icon" />,
    path: "/inventory/projects",
  },
  {
    title: "Asset Management",
    subtitle:
      "Value in Simplicity: Clear and Practical Asset Management Approaches.",
    icon: <CarOutlined className="diverse-trade-icon" />,
    path: "/inventory/assets/masterfile/upcoming-maintenance",
  },
  {
    title: "Inventory Reports",
    subtitle:
      "Quick Glance: Streamlined Inventory Reporting for Efficient Analysis.",
    icon: <BookOutlined className="diverse-trade-icon" />,
    path: `${frontEndUrl}/main/reports/stockcard`,
    customPath: true,
  },
];

export default invetoryMenu;
