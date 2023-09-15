import { MenuOutlined } from "@ant-design/icons";

const CashierSideBarMenu = {
  route: {
    path: "/",
    routes: [
      {
        path: "/accounting/cashier",
        name: "Financial P.O.S (Cashiering)",
        routes: [
          {
            path: "/accounting/cashier/accounts",
            name: "Account Folios",
          },
          {
            path: "/accounting/cashier/void-payments",
            name: "Void Payments",
          },
          {
            path: "/accounting/cashier/terminal-setup",
            name: "Terminals",
          },
          {
            path: "/accounting/cashier/cashier-admin",
            name: "Cashier Admin",
          },
          {
            path: "/accounting/cashier/collection-report",
            name: "Collection Reports",
          },
          {
            path: "/accounting/cashier/consolidation-report",
            name: "Consolidation Reports",
          },
        ],
      },
    ],
  },
  location: {
    pathname: "/",
  },
};

export default CashierSideBarMenu;
