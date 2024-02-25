const AccountingAccountsPayableMenu = {
  route: {
    path: "/inventory/deliveries",
    routes: [
      {
        path: "/inventory/deliveries/receiving",
        name: "Delivery Receiving",
        routes: [
          {
            path: "/inventory/deliveries/receiving/all",
            name: "All",
          },
          {
            path: "/inventory/deliveries/receiving/projects",
            name: "Projects",
          },
          {
            path: "/inventory/deliveries/receiving/spare-parts",
            name: "Spare Parts",
          },
          {
            path: "/inventory/deliveries/receiving/personal",
            name: "Personal",
          },
          {
            path: "/inventory/deliveries/receiving/fixed-assets",
            name: "Fixed Assets",
          },
          {
            path: "/inventory/deliveries/receiving/consignments",
            name: "Consignments",
          },
        ],
      },
      {
        path: "/inventory/deliveries/returns",
        name: "Return to Supplier",
        routes: [
          {
            path: "/inventory/purchases/returns",
            name: "Returns",
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
