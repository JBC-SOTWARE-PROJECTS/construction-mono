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
            path: "/inventory/purchases/purchase-request/projects",
            name: "Spare Parts",
          },
          {
            path: "/inventory/purchase-request/personal",
            name: "Personal",
          },
          {
            path: "/inventory/purchase-request/fixed-assets",
            name: "Fixed Assets",
          },
          {
            path: "/inventory/purchase-request/consignments",
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
            path: "/inventory/purchase-order/productions",
            name: "Projects",
          },
          {
            path: "/inventory/purchase-order/fix-assets",
            name: "Spare Parts",
          },
          {
            path: "/inventory/purchase-order/consignments",
            name: "Personal",
          },
          {
            path: "/inventory/purchase-order/fixed-assets",
            name: "Fixed Assets",
          },
          {
            path: "/inventory/purchase-order/consignments",
            name: "Consignments",
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
