const AccountingAccountsPayableMenu = {
  route: {
    path: "/inventory/issuances",
    routes: [
      {
        path: "/inventory/issuances/all",
        name: "Item Issuances",
        routes: [
          {
            path: "/inventory/issuances/all",
            name: "All",
          },
          {
            path: "/inventory/issuances/projects",
            name: "Projects",
          },
          {
            path: "/inventory/issuances/spare-parts",
            name: "Spare Parts",
          },
          {
            path: "/inventory/issuances/personal",
            name: "Personal",
          },
        ],
      },
      {
        path: "/inventory/issuances/expense",
        name: "Item Expenses",
        routes: [
          {
            path: "/inventory/issuances/expense/all",
            name: "All",
          },
          {
            path: "/inventory/issuances/expense/projects",
            name: "Projects",
          },
          {
            path: "/inventory/issuances/expense/spare-parts",
            name: "Spare Parts",
          },
          {
            path: "/inventory/issuances/expense/personal",
            name: "Personal",
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
