import { TDiverseTradeMenu } from "@/utility/interfaces";
import {
  SettingOutlined,
  ControlOutlined,
  DiffOutlined,
  FieldTimeOutlined,
  PayCircleOutlined,
  UsergroupAddOutlined,
  ReadOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

const accountingMenu: TDiverseTradeMenu[] = [
  {
    title: "Billing Portfolio Control Center",
    subtitle: "Effortlessly manage and oversee your list of billing records.",
    icon: <DiffOutlined className="diverse-trade-icon" />,
    path: "/accounting/billing",
  },
  {
    title: "Over the Counter (OTC) Transactions",
    subtitle: "Effortlessly manage and oversee your list of OTC records.",
    icon: <FieldTimeOutlined className="diverse-trade-icon" />,
    path: "/accounting/otc",
  },
  {
    title: "Financial Point of Service (Cashier)",
    subtitle: "Provide a reliable point of service for monetary interactions.",
    icon: <ControlOutlined className="diverse-trade-icon" />,
    path: "/accounting/cashier/accounts",
  },
  {
    title: "Accounts Receivable",
    subtitle: "Effortlessly manage and maintain your list of employees.",
    icon: <UsergroupAddOutlined className="diverse-trade-icon" />,
    path: "/accounting/accounts-receivable/invoice",
  },
  {
    title: "Accounts Payable",
    subtitle: "Monitor and control payment processes and transactions.",
    icon: <PayCircleOutlined className="diverse-trade-icon" />,
    path: "/accounting/accounts-payable/payables",
  },
  {
    title: "Loan Management",
    subtitle: "Effortlessly manage and maintain your list of employees.",
    icon: <UsergroupAddOutlined className="diverse-trade-icon" />,
    path: "/accounting/employees",
  },
  {
    title: "Fixed Asset",
    subtitle: "Effortlessly manage and maintain your list of employees.",
    icon: <UsergroupAddOutlined className="diverse-trade-icon" />,
    path: "/accounting/employees",
  },
  {
    title: "Cash Advance",
    subtitle: "Effortlessly manage and maintain your list of employees.",
    icon: <UsergroupAddOutlined className="diverse-trade-icon" />,
    path: "/accounting/employees",
  },
  {
    title: "Accounting Setup",
    subtitle: "Smooth Sailing: Easy Steps for Effective Accounting Configuration.",
    icon: <SettingOutlined className="diverse-trade-icon" />,
    path: "/accounting/accounting-setup/accounting-period",
  },
  {
    title: "Transaction Journal",
    subtitle:
      "Record of all financial activities in a business, documenting each entry before it goes into the general ledger.",
    icon: <ProfileOutlined className="diverse-trade-icon" />,
    path: "/accounting/transaction-journal/all",
  },
  {
    title: "Accounting Reports",
    subtitle: "Financial Clarity: Quick and Simple Accounting Reports for Smart Business Choices.",
    icon: <ReadOutlined className="diverse-trade-icon" />,
    path: "/accounting/reports/essential/general-ledger",
  },
];

export default accountingMenu;
