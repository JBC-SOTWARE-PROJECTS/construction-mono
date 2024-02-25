const AccountingAccountsPayableMenu = {
  route: {
    path: "/inventory/purchases",
    routes: [
      {
        path: "/inventory/purchases/purchase-request",
        name: "Purchase Request",
        routes: [
          {
            path: "/inventory/purchases/purchase-request/all",
            name: "All",
          },
          {
            path: "/inventory/purchases/purchase-request/projects",
            name: "Projects",
          },
          {
            path: "/inventory/purchases/purchase-request/spare-parts",
            name: "Spare Parts",
          },
          {
            path: "/inventory/purchases/purchase-request/personal",
            name: "Personal",
          },
          {
            path: "/inventory/purchases/purchase-request/fixed-assets",
            name: "Fixed Assets",
          },
          {
            path: "/inventory/purchases/purchase-request/consignments",
            name: "Consignments",
          },
        ],
      },
      {
        path: "/inventory/purchases/purchase-order",
        name: "Purchase Order",
        routes: [
          {
            path: "/inventory/purchases/purchase-order/all",
            name: "All",
          },
          {
            path: "/inventory/purchases/purchase-order/projects",
            name: "Projects",
          },
          {
            path: "/inventory/purchases/purchase-order/spare-parts",
            name: "Spare Parts",
          },
          {
            path: "/inventory/purchases/purchase-order/personal",
            name: "Personal",
          },
          {
            path: "/inventory/purchases/purchase-order/fixed-assets",
            name: "Fixed Assets",
          },
          {
            path: "/inventory/purchases/purchase-order/consignments",
            name: "Consignments",
          },
        ],
      },
      {
        path: "/inventory/purchases/purchase-order-monitoring",
        name: "Purchase Order Monitoring",
        routes: [
          {
            path: "/inventory/purchases/purchase-order-monitoring/all",
            name: "All",
          },
        ],
      },
    ],
  },
  location: {
    pathname: "/",
  },
};

export default AccountingAccountsPayableMenu;
