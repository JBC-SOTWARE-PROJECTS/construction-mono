const AccountingAccountsPayableMenu = {
  route: {
    path: "/inventory/projects",
    routes: [
      {
        path: "/inventory/projects/project-details",
        name: "Projects Menu",
        routes: [
          {
            path: "/inventory/masterfile/items/all",
            name: "Bill of Quantities",
          },
          {
            path: "/inventory/masterfile/items/productions",
            name: "Accomplishment Reports",
          },
          {
            path: "/inventory/masterfile/items/fix-assets",
            name: "Progress Reports",
          },
          {
            path: "/inventory/masterfile/items/consignments",
            name: "Project Materials Used",
          },
          {
            path: "/inventory/masterfile/items/consignments",
            name: "Project Expenses",
          },
          {
            path: "/inventory/masterfile/items/consignments",
            name: "Inventory Monitoring",
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
